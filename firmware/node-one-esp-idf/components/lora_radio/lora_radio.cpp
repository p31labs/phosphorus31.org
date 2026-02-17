/**
 * LoRa Radio Driver Implementation
 * Ebyte E22-900M30S (SX1262) with RadioLib
 * 
 * CRITICAL HARDWARE NOTES:
 * - SX1262 with external YP2233W PA (adds ~8dB)
 * - MUST check BUSY pin LOW before every SPI command
 * - TCXO on DIO3 at 1.8V
 * - TXEN/RXEN pins control external PA RF switch
 * - Set SX1262 to +22 dBm (PA adds rest to ~30 dBm)
 * - TX current: ~650mA peak, needs bulk decoupling
 * 
 * G.O.D. PROTOCOL COMPLIANCE:
 * - ✅ No admin backdoors
 * - ✅ No recovery functions
 * - ✅ No hardcoded credentials
 * - ✅ All operations require proper initialization
 * - ✅ Code for departure: No persistent admin access
 * - ✅ Abdication-ready: Operates in headless mode
 */

#include "lora_radio.h"
#include "pin_config.h"
#include "esp_log.h"
#include "esp_err.h"
#include "esp_timer.h"
#include "esp_rom_sys.h"
#include "driver/spi_master.h"
#include "driver/gpio.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/queue.h"
#include "freertos/semphr.h"
#include <string.h>
#include <cstdlib>

// RadioLib includes
#include <RadioLib.h>

static const char *TAG = "whale_channel";  // P31 naming: Whale Channel

// ============================================================================
// RadioLib ESP-IDF HAL Implementation
// ============================================================================

// RadioLib HAL GPIO/level constants for ESP-IDF (match RadioLibHal expectations)
#ifndef RADIOLIB_ESP32_GPIO
#define RADIOLIB_ESP32_GPIO
static const uint32_t RL_INPUT  = 0x01;
static const uint32_t RL_OUTPUT = 0x03;
static const uint32_t RL_LOW    = 0;
static const uint32_t RL_HIGH   = 1;
static const uint32_t RL_RISING = 0x01;
static const uint32_t RL_FALLING = 0x02;
#endif

/**
 * ESP-IDF HAL for RadioLib
 * Must inherit RadioLibHal and implement virtual methods.
 */
class EspHal : public RadioLibHal {
public:
    EspHal(gpio_num_t sck, gpio_num_t miso, gpio_num_t mosi, gpio_num_t nss,
           gpio_num_t busy, gpio_num_t rst, gpio_num_t dio1,
           gpio_num_t txen, gpio_num_t rxen)
        : RadioLibHal(RL_INPUT, RL_OUTPUT, RL_LOW, RL_HIGH, RL_RISING, RL_FALLING),
          sck_(sck), miso_(miso), mosi_(mosi), nss_(nss), busy_(busy),
          rst_(rst), dio1_(dio1), txen_(txen), rxen_(rxen),
          spi_handle_(nullptr), spi_host_(LORA_SPI_HOST), spi_bus_freed_(true) {
    }

    ~EspHal() {
        term();
    }

    void init() override {
        // Initialize SPI bus
        spi_bus_config_t bus_cfg = {};
        bus_cfg.mosi_io_num = mosi_;
        bus_cfg.miso_io_num = miso_;
        bus_cfg.sclk_io_num = sck_;
        bus_cfg.quadwp_io_num = -1;
        bus_cfg.quadhd_io_num = -1;
        bus_cfg.max_transfer_sz = 256;

        esp_err_t ret = spi_bus_initialize(spi_host_, &bus_cfg, SPI_DMA_DISABLED);
        if (ret != ESP_OK) {
            ESP_LOGE(TAG, "SPI bus init failed: %s", esp_err_to_name(ret));
            return;
        }
        spi_bus_freed_ = false;

        // Add SPI device
        spi_device_interface_config_t dev_cfg = {};
        dev_cfg.clock_speed_hz = LORA_SPI_CLK_SPEED;
        dev_cfg.mode = 0;  // SPI Mode 0
        dev_cfg.spics_io_num = -1;  // CS handled manually
        dev_cfg.queue_size = 1;
        dev_cfg.flags = 0;

        ret = spi_bus_add_device(spi_host_, &dev_cfg, &spi_handle_);
        if (ret != ESP_OK) {
            ESP_LOGE(TAG, "SPI device add failed: %s", esp_err_to_name(ret));
            spi_bus_free(spi_host_);
            return;
        }

        // Configure GPIO pins
        gpio_reset_pin(nss_);
        gpio_set_direction(nss_, GPIO_MODE_OUTPUT);
        gpio_set_level(nss_, 1);  // CS high (inactive)

        gpio_reset_pin(busy_);
        gpio_set_direction(busy_, GPIO_MODE_INPUT);

        gpio_reset_pin(rst_);
        gpio_set_direction(rst_, GPIO_MODE_OUTPUT);
        gpio_set_level(rst_, 1);  // Reset high (active)

        gpio_reset_pin(dio1_);
        gpio_set_direction(dio1_, GPIO_MODE_INPUT);
        gpio_set_pull_mode(dio1_, GPIO_PULLDOWN_ONLY);

        gpio_reset_pin(txen_);
        gpio_set_direction(txen_, GPIO_MODE_OUTPUT);
        gpio_set_level(txen_, 0);  // TXEN low (RX mode)

        gpio_reset_pin(rxen_);
        gpio_set_direction(rxen_, GPIO_MODE_OUTPUT);
        gpio_set_level(rxen_, 0);  // RXEN low (idle)
    }

    void term() override {
        if (spi_handle_) {
            spi_bus_remove_device(spi_handle_);
            spi_handle_ = nullptr;
        }
        if (!spi_bus_freed_) {
            spi_bus_free(spi_host_);
            spi_bus_freed_ = true;
        }
    }

    // GPIO operations (use base class GpioModeInput / GpioModeOutput)
    void pinMode(uint32_t pin, uint32_t mode) override {
        gpio_num_t gpio = (gpio_num_t)pin;
        gpio_reset_pin(gpio);
        if (mode == GpioModeInput) {
            gpio_set_direction(gpio, GPIO_MODE_INPUT);
        } else {
            gpio_set_direction(gpio, GPIO_MODE_OUTPUT);
        }
    }

    void digitalWrite(uint32_t pin, uint32_t value) override {
        gpio_set_level((gpio_num_t)pin, value);
    }

    uint32_t digitalRead(uint32_t pin) override {
        return gpio_get_level((gpio_num_t)pin);
    }

    // Timing operations
    void delay(unsigned long ms) override {
        vTaskDelay(pdMS_TO_TICKS(ms));
    }

    void delayMicroseconds(unsigned long us) override {
        esp_rom_delay_us(us);
    }

    unsigned long millis() override {
        return (unsigned long)(esp_timer_get_time() / 1000);
    }

    unsigned long micros() override {
        return (unsigned long)esp_timer_get_time();
    }

    long pulseIn(uint32_t pin, uint32_t state, RadioLibTime_t timeout) override {
        if (pin == RADIOLIB_NC) return 0;
        RadioLibTime_t start = micros();
        while (digitalRead(pin) != state) {
            if (micros() - start >= timeout) return 0;
            yield();
        }
        RadioLibTime_t pulseStart = micros();
        while (digitalRead(pin) == state) {
            if (micros() - pulseStart >= timeout) return 0;
            yield();
        }
        return (long)(micros() - pulseStart);
    }

    // SPI operations
    void spiBegin() override {
        // SPI already initialized in init()
    }

    void spiBeginTransaction() override {
        // Transaction handled in transfer()
    }

    void spiEndTransaction() override {
        // Transaction handled in transfer()
    }

    void spiEnd() override {
        if (spi_handle_) {
            spi_bus_remove_device(spi_handle_);
            spi_handle_ = nullptr;
        }
        if (!spi_bus_freed_) {
            spi_bus_free(spi_host_);
            spi_bus_freed_ = true;
        }
    }

    void spiTransfer(uint8_t* out, size_t len, uint8_t* in) override {
        if (!spi_handle_) {
            ESP_LOGE(TAG, "SPI handle not initialized");
            return;
        }

        if (len == 0) {
            return;
        }

        // CRITICAL: Wait for BUSY pin to be LOW before SPI command
        waitForBusy();

        spi_transaction_t t = {};
        t.length = len * 8;  // Length in bits
        t.tx_buffer = out;
        t.rx_buffer = in;
        t.flags = 0;

        // Manual CS control (RadioLib handles CS timing)
        gpio_set_level(nss_, 0);  // CS low (active)
        esp_err_t ret = spi_device_transmit(spi_handle_, &t);
        gpio_set_level(nss_, 1);  // CS high (inactive)

        if (ret != ESP_OK) {
            ESP_LOGE(TAG, "SPI transfer failed: %s (len=%zu)", esp_err_to_name(ret), len);
        }
    }

    // SX1262 BUSY pin polling (used in spiTransfer)
    void waitForBusy() {
        // Poll BUSY pin (LOW = ready, HIGH = busy)
        const uint32_t timeout_us = 1000000;  // 1 second timeout in microseconds
        uint64_t start = esp_timer_get_time();
        while (gpio_get_level(busy_) == 1) {
            uint64_t elapsed = esp_timer_get_time() - start;
            if (elapsed > timeout_us) {
                ESP_LOGW(TAG, "BUSY pin timeout after %llu us", elapsed);
                break;
            }
            // Small delay to avoid busy-waiting
            esp_rom_delay_us(10);
        }
    }

    bool isBusy() {
        return gpio_get_level(busy_) == 1;
    }

    // Interrupt handling
    void attachInterrupt(uint32_t interruptNum, void (*interruptCallback)(void), uint32_t mode) override {
        gpio_num_t gpio = (gpio_num_t)interruptNum;
        
        // RadioLib interrupt mode constants (matching Arduino style)
        const uint32_t RISING = 0x01;
        const uint32_t FALLING = 0x02;
        const uint32_t CHANGE = 0x03;
        
        gpio_int_type_t intr_type;
        switch (mode) {
            case RISING:
                intr_type = GPIO_INTR_POSEDGE;
                break;
            case FALLING:
                intr_type = GPIO_INTR_NEGEDGE;
                break;
            case CHANGE:
                intr_type = GPIO_INTR_ANYEDGE;
                break;
            default:
                intr_type = GPIO_INTR_ANYEDGE;
                break;
        }

        gpio_set_intr_type(gpio, intr_type);
        
        // Install ISR service if not already installed
        static bool isr_service_installed = false;
        if (!isr_service_installed) {
            gpio_install_isr_service(0);
            isr_service_installed = true;
        }

        gpio_isr_handler_add(gpio, (gpio_isr_t)interruptCallback, nullptr);
    }

    void detachInterrupt(uint32_t interruptNum) override {
        gpio_isr_handler_remove((gpio_num_t)interruptNum);
    }

private:
    gpio_num_t sck_, miso_, mosi_, nss_, busy_, rst_, dio1_, txen_, rxen_;
    spi_device_handle_t spi_handle_;
    spi_host_device_t spi_host_;
    bool spi_bus_freed_;
};

// ============================================================================
// Global state
// ============================================================================

static EspHal* hal = nullptr;
static Module* radio_module = nullptr;
static SX1262* radio = nullptr;
static bool initialized = false;

static whale_channel_rx_cb_t rx_callback = nullptr;
static void* rx_callback_ctx = nullptr;
static TaskHandle_t rx_task_handle = nullptr;
static QueueHandle_t dio1_queue = nullptr;
static SemaphoreHandle_t tx_mutex = nullptr;

// ============================================================================
// RX Task
// ============================================================================

static void IRAM_ATTR dio1_isr_handler(void* arg) {
    BaseType_t xHigherPriorityTaskWoken = pdFALSE;
    uint32_t dummy = 1;
    xQueueSendFromISR(dio1_queue, &dummy, &xHigherPriorityTaskWoken);
    if (xHigherPriorityTaskWoken) {
        portYIELD_FROM_ISR();
    }
}

static void rx_task(void* arg) {
    uint32_t dummy;
    
    ESP_LOGI(TAG, "RX task started");
    
    while (1) {
        // Wait for DIO1 interrupt (packet received or TX done)
        if (xQueueReceive(dio1_queue, &dummy, portMAX_DELAY)) {
            if (!radio) {
                ESP_LOGW(TAG, "RX task: radio not initialized");
                continue;
            }

            // Check if packet is available
            size_t len = radio->getPacketLength();
            if (len > 0 && len <= 255) {
                // Only process if callback is registered
                if (!rx_callback) {
                    // No callback, just clear the packet
                    uint8_t dummy_buf[256];
                    radio->readData(dummy_buf, len);
                    radio->startReceive();
                    continue;
                }

                // Allocate buffer for packet
                uint8_t* data = (uint8_t*)malloc(len);
                if (!data) {
                    ESP_LOGE(TAG, "Failed to allocate RX buffer (%zu bytes)", len);
                    // Clear the packet to avoid blocking
                    uint8_t dummy_buf[256];
                    radio->readData(dummy_buf, len);
                    radio->startReceive();
                    continue;
                }

                // Read packet
                int state = radio->readData(data, len);
                if (state == RADIOLIB_ERR_NONE) {
                    // Get RSSI and SNR
                    int16_t rssi = radio->getRSSI();
                    float snr = radio->getSNR();

                    // Create packet structure
                    whale_channel_packet_t packet;
                    packet.data = data;
                    packet.len = len;
                    packet.rssi = rssi;
                    packet.snr = snr;

                    ESP_LOGD(TAG, "RX: %zu bytes, RSSI=%d dBm, SNR=%.1f dB", len, rssi, snr);

                    // Call callback (must copy data if needed, we'll free it)
                    rx_callback(&packet, rx_callback_ctx);

                    // Free packet data (callback should have copied it if needed)
                    free(data);
                } else {
                    ESP_LOGW(TAG, "Failed to read packet: %d (len=%zu)", state, len);
                    free(data);
                }

                // Restart receive
                radio->startReceive();
            } else if (len == RADIOLIB_ERR_RX_TIMEOUT) {
                // Timeout - restart receive
                ESP_LOGD(TAG, "RX timeout, restarting receive");
                radio->startReceive();
            } else {
                // TX done or other interrupt - restart receive mode
                ESP_LOGD(TAG, "DIO1 interrupt (TX done?), restarting receive");
                radio->startReceive();
            }
        }
    }
}

// ============================================================================
// C API Implementation
// ============================================================================

extern "C" {

esp_err_t whale_channel_init(void) {
    if (initialized) {
        ESP_LOGW(TAG, "Whale Channel already initialized");
        return ESP_OK;
    }

    ESP_LOGI(TAG, "Initializing Whale Channel (E22-900M30S, LoRa 915MHz)");

    // Create HAL
    hal = new EspHal(
        PIN_LORA_SCK, PIN_LORA_MISO, PIN_LORA_MOSI,
        PIN_LORA_NSS, PIN_LORA_BUSY, PIN_LORA_NRST, PIN_LORA_DIO1,
        PIN_LORA_TXEN, PIN_LORA_RXEN
    );
    
    if (!hal) {
        ESP_LOGE(TAG, "Failed to create HAL");
        return ESP_ERR_NO_MEM;
    }

    hal->init();
    
    // Verify SPI was initialized (check if handle is set)
    // Note: We can't directly check, but if init() failed, SPI operations will fail
    // and RadioLib will report errors during begin()

    // Create RadioLib Module (hal is RadioLibHal*, cs, irq, rst, gpio)
    radio_module = new Module(
        (RadioLibHal *)hal,
        (uint32_t)PIN_LORA_NSS,
        (uint32_t)PIN_LORA_DIO1,
        (uint32_t)PIN_LORA_NRST,
        (uint32_t)PIN_LORA_BUSY
    );

    if (!radio_module) {
        ESP_LOGE(TAG, "Failed to create Module");
        delete hal;
        return ESP_ERR_NO_MEM;
    }

    // Create SX1262 instance (takes Module pointer)
    radio = new SX1262(radio_module);
    if (!radio) {
        ESP_LOGE(TAG, "Failed to create SX1262");
        delete radio_module;
        delete hal;
        return ESP_ERR_NO_MEM;
    }

    // Initialize radio
    int state = radio->begin(
        LORA_FREQUENCY_MHZ,
        LORA_BANDWIDTH_KHZ,
        LORA_SPREADING_FACTOR,
        LORA_CODING_RATE,
        LORA_SYNC_WORD,
        LORA_TX_POWER_DBM,
        LORA_PREAMBLE_LENGTH
    );

    if (state != RADIOLIB_ERR_NONE) {
        ESP_LOGE(TAG, "Radio begin failed: %d", state);
        delete radio;
        delete radio_module;
        delete hal;
        return ESP_FAIL;
    }

    // CRITICAL: Configure for E22-900M30S with external PA
    // Set TCXO voltage to 1.8V (TCXO on DIO3)
    state = radio->setTCXO(1.8);
    if (state != RADIOLIB_ERR_NONE) {
        ESP_LOGW(TAG, "setTCXO failed: %d", state);
    }

    // Use DC-DC regulator for efficiency
    state = radio->setRegulatorDCDC();
    if (state != RADIOLIB_ERR_NONE) {
        ESP_LOGW(TAG, "setRegulatorDCDC failed: %d", state);
    }

    // Configure RF switch pins for external PA (returns void)
    radio->setRfSwitchPins((uint32_t)PIN_LORA_RXEN, (uint32_t)PIN_LORA_TXEN);

    // Set current limit (safe for SX1262)
    state = radio->setCurrentLimit(140.0);
    if (state != RADIOLIB_ERR_NONE) {
        ESP_LOGW(TAG, "setCurrentLimit failed: %d", state);
    }

    // Create DIO1 interrupt queue
    dio1_queue = xQueueCreate(10, sizeof(uint32_t));
    if (!dio1_queue) {
        ESP_LOGE(TAG, "Failed to create DIO1 queue");
        delete radio;
        delete radio_module;
        delete hal;
        return ESP_ERR_NO_MEM;
    }

    // Create TX mutex
    tx_mutex = xSemaphoreCreateMutex();
    if (!tx_mutex) {
        ESP_LOGE(TAG, "Failed to create TX mutex");
        vQueueDelete(dio1_queue);
        delete radio;
        delete radio_module;
        delete hal;
        return ESP_ERR_NO_MEM;
    }

    // Configure DIO1 interrupt (install ISR service if not already installed)
    static bool isr_service_installed = false;
    if (!isr_service_installed) {
        esp_err_t ret = gpio_install_isr_service(0);
        if (ret != ESP_OK && ret != ESP_ERR_INVALID_STATE) {
            ESP_LOGE(TAG, "Failed to install ISR service: %s", esp_err_to_name(ret));
            vSemaphoreDelete(tx_mutex);
            vQueueDelete(dio1_queue);
            delete radio;
            delete radio_module;
            delete hal;
            return ESP_FAIL;
        }
        isr_service_installed = true;
    }
    
    gpio_set_intr_type(PIN_LORA_DIO1, GPIO_INTR_ANYEDGE);
    esp_err_t ret = gpio_isr_handler_add(PIN_LORA_DIO1, dio1_isr_handler, nullptr);
    if (ret != ESP_OK) {
        ESP_LOGE(TAG, "Failed to add DIO1 ISR handler: %s", esp_err_to_name(ret));
        vSemaphoreDelete(tx_mutex);
        vQueueDelete(dio1_queue);
        delete radio;
        delete radio_module;
        delete hal;
        return ESP_FAIL;
    }

    // Create RX task
    xTaskCreate(rx_task, "lora_rx", 4096, nullptr, 5, &rx_task_handle);
    if (!rx_task_handle) {
        ESP_LOGE(TAG, "Failed to create RX task");
        gpio_isr_handler_remove(PIN_LORA_DIO1);
        vSemaphoreDelete(tx_mutex);
        vQueueDelete(dio1_queue);
        delete radio;
        delete radio_module;
        delete hal;
        return ESP_ERR_NO_MEM;
    }

    initialized = true;
    ESP_LOGI(TAG, "Whale Channel initialized successfully");
    
    return ESP_OK;
}

esp_err_t whale_channel_deinit(void) {
    if (!initialized) {
        return ESP_OK;
    }

    ESP_LOGI(TAG, "Deinitializing Whale Channel");

    // Stop receive callback
    rx_callback = nullptr;
    rx_callback_ctx = nullptr;

    // Put radio in sleep mode
    if (radio) {
        radio->sleep();
    }

    // Remove interrupt handler
    gpio_isr_handler_remove(PIN_LORA_DIO1);

    // Delete RX task (must be done before queue deletion)
    if (rx_task_handle) {
        vTaskDelete(rx_task_handle);
        rx_task_handle = nullptr;
        // Give task time to exit
        vTaskDelay(pdMS_TO_TICKS(100));
    }

    // Cleanup RadioLib objects
    if (radio) {
        delete radio;
        radio = nullptr;
    }

    if (radio_module) {
        delete radio_module;
        radio_module = nullptr;
    }

    if (hal) {
        hal->term();
        delete hal;
        hal = nullptr;
    }

    // Cleanup FreeRTOS objects
    if (dio1_queue) {
        vQueueDelete(dio1_queue);
        dio1_queue = nullptr;
    }

    if (tx_mutex) {
        vSemaphoreDelete(tx_mutex);
        tx_mutex = nullptr;
    }

    initialized = false;
    ESP_LOGI(TAG, "Whale Channel deinitialized");
    
    return ESP_OK;
}

esp_err_t whale_channel_send(const uint8_t *data, size_t len) {
    if (!initialized || !radio) {
        ESP_LOGE(TAG, "Radio not initialized");
        return ESP_ERR_INVALID_STATE;
    }

    if (!data || len == 0 || len > 255) {
        ESP_LOGE(TAG, "Invalid TX parameters: data=%p, len=%zu", data, len);
        return ESP_ERR_INVALID_ARG;
    }

    // Take TX mutex (with timeout to avoid deadlock)
    if (xSemaphoreTake(tx_mutex, pdMS_TO_TICKS(5000)) != pdTRUE) {
        ESP_LOGE(TAG, "TX mutex timeout");
        return ESP_ERR_TIMEOUT;
    }

    ESP_LOGD(TAG, "TX: %zu bytes", len);

    // Transmit packet (blocking)
    int state = radio->transmit((uint8_t*)data, len);
    
    xSemaphoreGive(tx_mutex);

    if (state != RADIOLIB_ERR_NONE) {
        ESP_LOGE(TAG, "Transmit failed: %d (len=%zu)", state, len);
        // Try to restart receive mode even on failure
        radio->startReceive();
        return ESP_FAIL;
    }

    ESP_LOGD(TAG, "TX successful: %zu bytes", len);

    // Restart receive mode
    radio->startReceive();

    return ESP_OK;
}

esp_err_t whale_channel_start_receive(whale_channel_rx_cb_t callback, void *ctx) {
    if (!initialized || !radio) {
        return ESP_ERR_INVALID_STATE;
    }

    rx_callback = callback;
    rx_callback_ctx = ctx;

    // Start continuous receive
    int state = radio->startReceive();
    if (state != RADIOLIB_ERR_NONE) {
        ESP_LOGE(TAG, "startReceive failed: %d", state);
        return ESP_FAIL;
    }

    return ESP_OK;
}

esp_err_t whale_channel_stop_receive(void) {
    if (!initialized || !radio) {
        return ESP_OK;
    }

    rx_callback = nullptr;
    rx_callback_ctx = nullptr;

    // RadioLib doesn't have explicit stopReceive, but we can set to standby
    radio->standby();

    return ESP_OK;
}

esp_err_t whale_channel_sleep(void) {
    if (!initialized || !radio) {
        return ESP_ERR_INVALID_STATE;
    }

    int state = radio->sleep();
    if (state != RADIOLIB_ERR_NONE) {
        ESP_LOGE(TAG, "sleep failed: %d", state);
        return ESP_FAIL;
    }

    return ESP_OK;
}

esp_err_t whale_channel_set_frequency(float freq_mhz) {
    if (!initialized || !radio) {
        return ESP_ERR_INVALID_STATE;
    }

    int state = radio->setFrequency(freq_mhz);
    if (state != RADIOLIB_ERR_NONE) {
        ESP_LOGE(TAG, "setFrequency failed: %d", state);
        return ESP_FAIL;
    }

    return ESP_OK;
}

esp_err_t whale_channel_set_power(int8_t dbm) {
    if (!initialized || !radio) {
        return ESP_ERR_INVALID_STATE;
    }

    // Limit to 22 dBm (PA adds ~8dB more)
    if (dbm > 22) {
        dbm = 22;
    }

    int state = radio->setOutputPower(dbm);
    if (state != RADIOLIB_ERR_NONE) {
        ESP_LOGE(TAG, "setOutputPower failed: %d", state);
        return ESP_FAIL;
    }

    return ESP_OK;
}

int whale_channel_get_rssi(void) {
    if (!initialized || !radio) {
        return 0;
    }

    return radio->getRSSI();
}

} // extern "C"
