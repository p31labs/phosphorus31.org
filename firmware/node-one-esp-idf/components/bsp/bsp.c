/**
 * Board Support Package (BSP) Implementation
 * ESP32-S3-Touch-LCD-3.5B
 */

#include "bsp.h"
#include "esp_log.h"
#include "esp_err.h"
#include "driver/i2c_master.h"
#include "driver/ledc.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"

static const char *TAG = "BSP";

// Singleton I2C bus handle
static i2c_master_bus_handle_t s_i2c_bus = NULL;

// AXP2101 device handle
static i2c_master_dev_handle_t s_axp2101_dev = NULL;

// Backlight LEDC channel
static bool s_backlight_initialized = false;
#define BACKLIGHT_LEDC_TIMER      LEDC_TIMER_0
#define BACKLIGHT_LEDC_MODE        LEDC_LOW_SPEED_MODE
#define BACKLIGHT_LEDC_CHANNEL     LEDC_CHANNEL_0

/**
 * Write AXP2101 register
 */
static esp_err_t axp2101_write_reg(uint8_t reg, uint8_t value)
{
    if (s_axp2101_dev == NULL) {
        ESP_LOGE(TAG, "AXP2101 device not initialized");
        return ESP_FAIL;
    }

    uint8_t buffer[2] = {reg, value};
    esp_err_t ret = i2c_master_transmit(s_axp2101_dev, buffer, 2, 100);
    if (ret != ESP_OK) {
        ESP_LOGE(TAG, "AXP2101 write reg 0x%02X failed: %s", reg, esp_err_to_name(ret));
    }
    return ret;
}

/**
 * Read AXP2101 register
 */
static uint8_t axp2101_read_reg(uint8_t reg)
{
    if (s_axp2101_dev == NULL) {
        ESP_LOGE(TAG, "AXP2101 device not initialized");
        return 0;
    }

    uint8_t value = 0;
    esp_err_t ret = i2c_master_transmit_receive(s_axp2101_dev, &reg, 1, &value, 1, 100);
    if (ret != ESP_OK) {
        ESP_LOGE(TAG, "AXP2101 read reg 0x%02X failed: %s", reg, esp_err_to_name(ret));
        return 0;
    }
    return value;
}

i2c_master_bus_handle_t bsp_i2c_init(void)
{
    if (s_i2c_bus != NULL) {
        ESP_LOGW(TAG, "I2C bus already initialized");
        return s_i2c_bus;
    }

    ESP_LOGI(TAG, "Initializing I2C bus (SDA=%d, SCL=%d, freq=%d Hz)", 
             BSP_I2C_SDA, BSP_I2C_SCL, BSP_I2C_FREQ_HZ);

    i2c_master_bus_config_t i2c_bus_cfg = {
        .i2c_port = I2C_NUM_0,
        .sda_io_num = BSP_I2C_SDA,
        .scl_io_num = BSP_I2C_SCL,
        .clk_source = I2C_CLK_SRC_DEFAULT,
        .glitch_ignore_cnt = 7,
        .flags = {
            .enable_internal_pullup = true,
        },
    };

    esp_err_t ret = i2c_new_master_bus(&i2c_bus_cfg, &s_i2c_bus);
    if (ret != ESP_OK) {
        ESP_LOGE(TAG, "I2C bus init failed: %s", esp_err_to_name(ret));
        return NULL;
    }

    ESP_LOGI(TAG, "I2C bus initialized successfully");
    return s_i2c_bus;
}

esp_err_t bsp_power_init(i2c_master_bus_handle_t bus)
{
    if (bus == NULL) {
        ESP_LOGE(TAG, "I2C bus handle is NULL");
        return ESP_ERR_INVALID_ARG;
    }

    if (s_axp2101_dev != NULL) {
        ESP_LOGW(TAG, "AXP2101 already initialized");
        return ESP_OK;
    }

    ESP_LOGI(TAG, "Initializing AXP2101 PMIC (addr=0x%02X)", BSP_AXP2101_ADDR);

    // Add AXP2101 device to I2C bus
    i2c_device_config_t axp2101_cfg = {
        .dev_addr_length = I2C_ADDR_BIT_LEN_7,
        .device_address = BSP_AXP2101_ADDR,
        .scl_speed_hz = BSP_I2C_FREQ_HZ,
        .scl_wait_us = 0,
        .flags = {
            .disable_ack_check = 0,
        },
    };

    esp_err_t ret = i2c_master_bus_add_device(bus, &axp2101_cfg, &s_axp2101_dev);
    if (ret != ESP_OK) {
        ESP_LOGE(TAG, "Failed to add AXP2101 device: %s", esp_err_to_name(ret));
        return ret;
    }

    ESP_LOGI(TAG, "AXP2101 device added to I2C bus");

    // Small delay for device to be ready
    vTaskDelay(pdMS_TO_TICKS(10));

    // Configure power-off behavior
    ESP_LOGI(TAG, "Configuring AXP2101 power-off behavior");
    ret = axp2101_write_reg(0x22, 0b110);  // PWRON > OFFLEVEL as POWEROFF Source enable
    if (ret != ESP_OK) return ret;
    
    ret = axp2101_write_reg(0x27, 0x10);  // Hold 4s to power off
    if (ret != ESP_OK) return ret;

    // Disable all DCs except DC1
    ESP_LOGI(TAG, "Configuring DC rails");
    ret = axp2101_write_reg(0x80, 0x01);
    if (ret != ESP_OK) return ret;

    // Disable all LDOs first
    ESP_LOGI(TAG, "Disabling all LDOs");
    ret = axp2101_write_reg(0x90, 0x00);  // LDO_ONOFF_CTRL0 (ALDO1-4, BLDO1-2)
    if (ret != ESP_OK) return ret;
    
    ret = axp2101_write_reg(0x91, 0x00);  // LDO_ONOFF_CTRL1 (DLDO1-2)
    if (ret != ESP_OK) return ret;

    // Set DC1 to 3.3V
    // Register 0x82: DC1 voltage = (voltage_mv - 1500) / 100
    ESP_LOGI(TAG, "Setting DC1 to 3.3V");
    ret = axp2101_write_reg(0x82, (3300 - 1500) / 100);
    if (ret != ESP_OK) return ret;

    // Set ALDO1 to 3.3V (display logic power)
    // Register 0x92: ALDO1 voltage = (voltage_mv - 500) / 100
    ESP_LOGI(TAG, "Setting ALDO1 to 3.3V (display logic)");
    ret = axp2101_write_reg(0x92, (3300 - 500) / 100);
    if (ret != ESP_OK) return ret;

    // Set ALDO3 to 3.3V (backlight power - CRITICAL!)
    // Register 0x94: ALDO3 voltage = (voltage_mv - 500) / 100
    ESP_LOGI(TAG, "Setting ALDO3 to 3.3V (backlight power)");
    ret = axp2101_write_reg(0x94, (3300 - 500) / 100);
    if (ret != ESP_OK) return ret;

    // Set BLDO1 to 1.5V
    // Register 0x96: BLDO1 voltage = (voltage_mv - 500) / 100
    ESP_LOGI(TAG, "Setting BLDO1 to 1.5V");
    ret = axp2101_write_reg(0x96, (1500 - 500) / 100);
    if (ret != ESP_OK) return ret;

    // Set BLDO2 to 2.8V (audio codec power)
    // Register 0x97: BLDO2 voltage = (voltage_mv - 500) / 100
    ESP_LOGI(TAG, "Setting BLDO2 to 2.8V (audio codec)");
    ret = axp2101_write_reg(0x97, (2800 - 500) / 100);
    if (ret != ESP_OK) return ret;

    // Enable ALDO1, ALDO3, BLDO1, BLDO2
    // Register 0x90 bits: ALDO1(bit0), ALDO2(bit1), ALDO3(bit2), ALDO4(bit3), BLDO1(bit4), BLDO2(bit5)
    // 0x35 = 0b00110101 = ALDO1 + ALDO3 + BLDO1 + BLDO2
    ESP_LOGI(TAG, "Enabling power rails: ALDO1, ALDO3, BLDO1, BLDO2");
    ret = axp2101_write_reg(0x90, 0x35);
    if (ret != ESP_OK) return ret;

    // Configure battery charging
    ESP_LOGI(TAG, "Configuring battery charging");
    ret = axp2101_write_reg(0x64, 0x02);  // CV charger voltage setting to 4.1V
    if (ret != ESP_OK) return ret;
    
    ret = axp2101_write_reg(0x61, 0x02);  // Main battery precharge current to 50mA
    if (ret != ESP_OK) return ret;
    
    ret = axp2101_write_reg(0x62, 0x08);  // Main battery charger current to 400mA
    if (ret != ESP_OK) return ret;
    
    ret = axp2101_write_reg(0x63, 0x01);  // Main battery term charge current to 25mA
    if (ret != ESP_OK) return ret;

    // Read and log battery voltage
    uint16_t voltage = bsp_battery_voltage();
    ESP_LOGI(TAG, "Battery voltage: %d mV", voltage);

    ESP_LOGI(TAG, "AXP2101 initialization complete");
    return ESP_OK;
}

esp_err_t bsp_backlight_set(uint8_t percent)
{
    if (percent > 100) {
        ESP_LOGW(TAG, "Backlight percent clamped to 100");
        percent = 100;
    }

    // Initialize LEDC if not already done
    if (!s_backlight_initialized) {
        ESP_LOGI(TAG, "Initializing backlight PWM (GPIO%d)", BSP_BACKLIGHT_PIN);

        // Configure LEDC timer
        ledc_timer_config_t ledc_timer = {
            .speed_mode = BACKLIGHT_LEDC_MODE,
            .timer_num = BACKLIGHT_LEDC_TIMER,
            .duty_resolution = LEDC_TIMER_13_BIT,  // 8192 steps
            .freq_hz = 5000,  // 5 kHz PWM frequency
            .clk_cfg = LEDC_AUTO_CLK,
        };
        esp_err_t ret = ledc_timer_config(&ledc_timer);
        if (ret != ESP_OK) {
            ESP_LOGE(TAG, "LEDC timer config failed: %s", esp_err_to_name(ret));
            return ret;
        }

        // Configure LEDC channel
        ledc_channel_config_t ledc_channel = {
            .speed_mode = BACKLIGHT_LEDC_MODE,
            .channel = BACKLIGHT_LEDC_CHANNEL,
            .timer_sel = BACKLIGHT_LEDC_TIMER,
            .intr_type = LEDC_INTR_DISABLE,
            .gpio_num = BSP_BACKLIGHT_PIN,
            .duty = 0,
            .hpoint = 0,
        };
        ret = ledc_channel_config(&ledc_channel);
        if (ret != ESP_OK) {
            ESP_LOGE(TAG, "LEDC channel config failed: %s", esp_err_to_name(ret));
            return ret;
        }

        s_backlight_initialized = true;
        ESP_LOGI(TAG, "Backlight PWM initialized");
    }

    // Calculate duty cycle: percent * 8192 / 100
    uint32_t duty = (percent * 8192) / 100;
    
    esp_err_t ret = ledc_set_duty(BACKLIGHT_LEDC_MODE, BACKLIGHT_LEDC_CHANNEL, duty);
    if (ret != ESP_OK) {
        ESP_LOGE(TAG, "Failed to set LEDC duty: %s", esp_err_to_name(ret));
        return ret;
    }

    ret = ledc_update_duty(BACKLIGHT_LEDC_MODE, BACKLIGHT_LEDC_CHANNEL);
    if (ret != ESP_OK) {
        ESP_LOGE(TAG, "Failed to update LEDC duty: %s", esp_err_to_name(ret));
        return ret;
    }

    ESP_LOGI(TAG, "Backlight set to %d%% (duty=%lu)", percent, duty);
    return ESP_OK;
}

uint16_t bsp_battery_voltage(void)
{
    if (s_axp2101_dev == NULL) {
        ESP_LOGE(TAG, "AXP2101 not initialized");
        return 0;
    }

    // Read battery voltage from AXP2101 ADC registers
    // AXP2101 battery voltage ADC registers (typical):
    // Register 0x78: Battery voltage ADC data (low byte)
    // Register 0x79: Battery voltage ADC data (high byte)
    // Note: Actual register addresses may vary - verify against AXP2101 datasheet
    // Voltage conversion formula: voltage_mv = (ADC_value * scale_factor)
    // Common scale factors: 0.8 mV/LSB or 1.1 mV/LSB depending on ADC range
    
    uint8_t vbat_low = axp2101_read_reg(0x78);
    uint8_t vbat_high = axp2101_read_reg(0x79);
    
    // Combine high and low bytes (12-bit or 13-bit ADC typical)
    uint16_t adc_value = (vbat_high << 8) | vbat_low;
    
    // Convert ADC value to millivolts
    // Using 0.8 mV/LSB conversion (common for AXP2101)
    // Formula: voltage_mv = (adc_value * 0.8)
    // Using integer math: voltage_mv = (adc_value * 4) / 5
    // Range: typically 2600-4200 mV for Li-ion battery
    // TODO: Calibrate conversion factor based on actual hardware measurements
    uint16_t voltage_mv = (adc_value * 4) / 5;
    
    // Clamp to reasonable range (2.6V - 4.5V)
    if (voltage_mv < 2600) voltage_mv = 2600;
    if (voltage_mv > 4500) voltage_mv = 4500;
    
    return voltage_mv;
}

uint8_t bsp_battery_percent(void)
{
    uint16_t voltage_mv = bsp_battery_voltage();
    if (voltage_mv == 0) {
        return 0;  // Error reading voltage
    }
    
    // Convert voltage to percentage using typical Li-ion curve
    // Linear approximation:
    // 4.2V (4200mV) = 100%
    // 3.7V (3700mV) = 50% (nominal voltage)
    // 3.0V (3000mV) = 0% (cutoff)
    //
    // Note: AXP2101 also has a direct battery level register (0xA4) that
    // returns 0-100 directly. This voltage-based approach provides more
    // control and can be calibrated per battery chemistry.
    
    uint8_t percent = 0;
    
    if (voltage_mv >= 4200) {
        percent = 100;
    } else if (voltage_mv >= 3700) {
        // 3700-4200mV: 50-100% (500mV range)
        percent = 50 + ((voltage_mv - 3700) * 50) / 500;
    } else if (voltage_mv >= 3000) {
        // 3000-3700mV: 0-50% (700mV range)
        percent = ((voltage_mv - 3000) * 50) / 700;
    } else {
        percent = 0;  // Below cutoff
    }
    
    // Clamp to 0-100 (defensive programming)
    if (percent > 100) percent = 100;
    
    return percent;
}

bool bsp_battery_is_charging(void)
{
    if (s_axp2101_dev == NULL) {
        ESP_LOGE(TAG, "AXP2101 not initialized");
        return false;
    }

    // Read AXP2101 status register (0x01)
    // Bits 5-6: Battery current direction
    // 01 = Charging, 10 = Discharging, 00/11 = Standby
    uint8_t status = axp2101_read_reg(0x01);
    uint8_t direction = (status & 0b01100000) >> 5;
    
    return (direction == 1);  // 01 = Charging
}

bool bsp_battery_is_discharging(void)
{
    if (s_axp2101_dev == NULL) {
        ESP_LOGE(TAG, "AXP2101 not initialized");
        return false;
    }

    // Read AXP2101 status register (0x01)
    // Bits 5-6: Battery current direction
    // 01 = Charging, 10 = Discharging, 00/11 = Standby
    uint8_t status = axp2101_read_reg(0x01);
    uint8_t direction = (status & 0b01100000) >> 5;
    
    return (direction == 2);  // 10 = Discharging
}

bool bsp_battery_is_charging_done(void)
{
    if (s_axp2101_dev == NULL) {
        ESP_LOGE(TAG, "AXP2101 not initialized");
        return false;
    }

    // Read AXP2101 status register (0x01)
    // Bits 0-2: Charging status
    // 100 = Charging done
    uint8_t status = axp2101_read_reg(0x01);
    
    return ((status & 0b00000111) == 0b00000100);  // 100 = Charging done
}

i2c_master_bus_handle_t bsp_get_i2c_bus(void)
{
    return s_i2c_bus;
}
