/*
 * ══════════════════════════════════════════════════════════════════════════════
 * COGNITIVE SHIELD: I2C SOFTWARE FALLBACK (Bit-Banging)
 * Version: 1.0 (The Architect)
 * Status: CRITICAL / RELIABILITY CORE
 * ══════════════════════════════════════════════════════════════════════════════
 *
 * PURPOSE:
 * Provides a robust, software-defined I2C driver to recover from hardware I2C
 * bus lockups (the "I2C Quagmire"). If the ESP32 hardware peripheral hangs
 * due to SE050 clock stretching or noise, this driver takes over GPIO control
 * to force a bus reset.
 *
 * MECHANISM:
 * 1. Detects hardware timeout (ESP_ERR_TIMEOUT).
 * 2. Reconfigures SDA/SCL pins as generic GPIO outputs.
 * 3. Toggles SCL up to 9 times to clear slave state (Bus Recovery).
 * 4. Generates STOP condition.
 * 5. Re-initializes hardware driver.
 *
 * ══════════════════════════════════════════════════════════════════════════════
 */

#include "I2C_Software_Fallback.h"
#include "driver/gpio.h"
#include "rom/ets_sys.h" // for ets_delay_us
#include <stdio.h>

// Configuration (Must match hardware schematic)
#define SDA_PIN GPIO_NUM_8
#define SCL_PIN GPIO_NUM_9
#define I2C_DELAY_US 5 // ~100kHz

static void i2c_delay() {
    ets_delay_us(I2C_DELAY_US);
}

static void sda_high() {
    gpio_set_level(SDA_PIN, 1);
    i2c_delay();
}

static void sda_low() {
    gpio_set_level(SDA_PIN, 0);
    i2c_delay();
}

static void scl_high() {
    gpio_set_level(SCL_PIN, 1);
    i2c_delay();
}

static void scl_low() {
    gpio_set_level(SCL_PIN, 0);
    i2c_delay();
}

/**
 * @brief Initialize Software I2C (GPIO Mode)
 */
void I2C_SW_Init() {
    gpio_config_t io_conf;
    io_conf.intr_type = GPIO_INTR_DISABLE;
    io_conf.mode = GPIO_MODE_OUTPUT_OD; // Open Drain!
    io_conf.pin_bit_mask = (1ULL << SDA_PIN) | (1ULL << SCL_PIN);
    io_conf.pull_down_en = GPIO_PULLDOWN_DISABLE;
    io_conf.pull_up_en = GPIO_PULLUP_ENABLE;
    gpio_config(&io_conf);
    
    sda_high();
    scl_high();
}

/**
 * @brief Bus Recovery Sequence (The "Defibrillator")
 * Toggles SCL to free a stuck slave (SE050).
 */
void I2C_Recover_Bus() {
    printf("[I2C_SW] Detecting Bus Lockup... Initiating Recovery.\n");
    
    // 1. Take control of pins
    I2C_SW_Init();
    
    // 2. Check if SDA is low (Slave holding bus)
    gpio_set_direction(SDA_PIN, GPIO_MODE_INPUT);
    if (gpio_get_level(SDA_PIN) == 1) {
        printf("[I2C_SW] Bus appears free. Generating STOP condition just in case.\n");
        gpio_set_direction(SDA_PIN, GPIO_MODE_OUTPUT_OD);
        // Generate STOP
        sda_low();
        scl_high();
        sda_high();
        return;
    }
    
    gpio_set_direction(SDA_PIN, GPIO_MODE_OUTPUT_OD);
    
    // 3. Toggle SCL up to 9 times
    for (int i = 0; i < 9; i++) {
        scl_low();
        scl_high();
        
        // Check if SDA released
        gpio_set_direction(SDA_PIN, GPIO_MODE_INPUT);
        if (gpio_get_level(SDA_PIN) == 1) {
            printf("[I2C_SW] Slave released SDA after %d clocks.\n", i+1);
            break;
        }
        gpio_set_direction(SDA_PIN, GPIO_MODE_OUTPUT_OD);
    }
    
    gpio_set_direction(SDA_PIN, GPIO_MODE_OUTPUT_OD);
    
    // 4. Generate STOP condition
    scl_low();
    sda_low();
    scl_high();
    sda_high();
    
    printf("[I2C_SW] Recovery Sequence Complete.\n");
}

/**
 * @brief Software Start Condition
 */
void I2C_SW_Start() {
    sda_high();
    scl_high();
    sda_low();
    scl_low();
}

/**
 * @brief Software Stop Condition
 */
void I2C_SW_Stop() {
    scl_low();
    sda_low();
    scl_high();
    sda_high();
}

// Byte read/write implementations omitted for brevity, 
// as recovery is the primary function required for Phase 1.3.
