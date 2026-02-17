/**
 * Node One - GPIO Pin Configuration
 * Waveshare ESP32-S3-Touch-LCD-3.5B
 * 
 * Complete pin mapping for all peripherals:
 * - QSPI Display (AXS15231B)
 * - I2S Audio (ES8311)
 * - I2C Bus (shared: AXP2101, ES8311, QMI8658, PCF85063, MCP23017, Touch)
 * - LoRa Module (E22-900M30S via SX1262)
 * - MCP23017 I2C Expander
 * - SD Card
 * - Camera (not used, pins available for LoRa)
 */

#ifndef PIN_CONFIG_H
#define PIN_CONFIG_H

#include "driver/gpio.h"

// ============================================================================
// I2C Bus (Shared by all on-board sensors + MCP23017)
// ============================================================================
#define PIN_I2C_SDA          GPIO_NUM_8
#define PIN_I2C_SCL          GPIO_NUM_7
#define I2C_PORT_NUM         I2C_NUM_0
#define I2C_CLK_SPEED_HZ     400000  // 400 kHz

// I2C Device Addresses
#define I2C_ADDR_ES8311      0x18    // Audio codec (or 0x19)
#define I2C_ADDR_AXP2101     0x34    // Power management
#define I2C_ADDR_PCF85063    0x51    // RTC
#define I2C_ADDR_QMI8658     0x6B    // IMU (or 0x6A)
#define I2C_ADDR_MCP23017    0x20    // I2C GPIO expander
#define I2C_ADDR_TOUCH       0x38    // FT6336 touch controller

// ============================================================================
// QSPI Display (AXS15231B)
// ============================================================================
// Based on memory: QSPI pins CS=GPIO12, CLK=GPIO5, DATA0=GPIO1, DATA1=GPIO2, DATA2=GPIO3, DATA3=GPIO4
#define PIN_QSPI_CS          GPIO_NUM_12
#define PIN_QSPI_CLK         GPIO_NUM_5
#define PIN_QSPI_DATA0       GPIO_NUM_1
#define PIN_QSPI_DATA1       GPIO_NUM_2
#define PIN_QSPI_DATA2       GPIO_NUM_3
#define PIN_QSPI_DATA3       GPIO_NUM_4
#define PIN_DISPLAY_BL       GPIO_NUM_6   // Backlight (LEDC PWM)

// Display Resolution (Portrait)
#define DISPLAY_WIDTH        320
#define DISPLAY_HEIGHT       480

// ============================================================================
// I2S Audio (ES8311)
// ============================================================================
// Verified from waveshare-s3-touch-lcd-3.5b config.h: MCLK=44, BCLK=13, LRCK=15, DOUT=16, DIN=14
// 24kHz sample rate, mono
#define PIN_I2S_MCLK         GPIO_NUM_44
#define PIN_I2S_BCLK         GPIO_NUM_13
#define PIN_I2S_LRCK         GPIO_NUM_15
#define PIN_I2S_DOUT         GPIO_NUM_16
#define PIN_I2S_DIN          GPIO_NUM_14

// ============================================================================
// SD Card (SD_MMC 1-bit mode)
// ============================================================================
// From demo code: CMD=10, D0=9, CLK=11
#define PIN_SD_CMD           GPIO_NUM_10
#define PIN_SD_D0            GPIO_NUM_9
#define PIN_SD_CLK           GPIO_NUM_11

// ============================================================================
// LoRa Module (E22-900M30S - SX1262)
// ============================================================================
// Using camera pins (camera not used in Node One)
// E22 Pin 18 -> SCK
#define PIN_LORA_SCK         GPIO_NUM_41  // Camera PCLK freed
// E22 Pin 17 -> MOSI
#define PIN_LORA_MOSI        GPIO_NUM_42  // Camera Y6 freed
// E22 Pin 16 -> MISO
#define PIN_LORA_MISO        GPIO_NUM_39  // Camera Y8 freed
// E22 Pin 19 -> NSS (CS)
#define PIN_LORA_NSS         GPIO_NUM_40  // Camera Y7 freed
// E22 Pin 14 -> BUSY
#define PIN_LORA_BUSY        GPIO_NUM_21  // Camera Y9 freed
// E22 Pin 13 -> DIO1 (IRQ)
#define PIN_LORA_DIO1        GPIO_NUM_38  // Camera XCLK freed
// E22 Pin 15 -> NRST
#define PIN_LORA_NRST        GPIO_NUM_45  // Camera Y2 freed
// E22 Pin 7 -> TXEN
#define PIN_LORA_TXEN        GPIO_NUM_47  // Camera Y3 freed
// E22 Pin 6 -> RXEN
#define PIN_LORA_RXEN        GPIO_NUM_48  // Camera Y4 freed

// LoRa SPI Configuration
// Note: Display uses SPI2_HOST for QSPI, so LoRa should use SPI3_HOST
#define LORA_SPI_HOST        SPI3_HOST
#define LORA_SPI_CLK_SPEED   10000000  // 10 MHz max for E22 module

// LoRa RF Configuration (915 MHz ISM band)
#define LORA_FREQUENCY_MHZ   915.0
#define LORA_BANDWIDTH_KHZ   125.0
#define LORA_SPREADING_FACTOR 9
#define LORA_CODING_RATE      7
#define LORA_SYNC_WORD        0x12
#define LORA_TX_POWER_DBM     22        // +22 dBm on SX1262 = +30 dBm from module
#define LORA_PREAMBLE_LENGTH  8

// ============================================================================
// MCP23017 I2C GPIO Expander
// ============================================================================
// Interrupt pin (INTA/INTB mirrored)
#define PIN_MCP23017_INT     GPIO_NUM_46  // Camera Y5 freed (or use GPIO17/18 if available)

// MCP23017 usable pins (avoid GPA7/GPB7 per datasheet errata)
// GPA0-GPA6, GPB0-GPB6 = 14 usable input pins for buttons/haptics

// ============================================================================
// System GPIOs
// ============================================================================
#define PIN_BOOT_BUTTON      GPIO_NUM_0
#define PIN_USB_DM           GPIO_NUM_19
#define PIN_USB_DP           GPIO_NUM_20

// ============================================================================
// Camera Pins (NOT USED - Available for LoRa)
// ============================================================================
// These pins are allocated to LoRa module:
// GPIO38 (XCLK) -> LORA_DIO1
// GPIO21 (Y9)   -> LORA_BUSY
// GPIO39 (Y8)   -> LORA_MISO
// GPIO40 (Y7)   -> LORA_NSS
// GPIO42 (Y6)   -> LORA_MOSI
// GPIO45 (Y2)   -> LORA_NRST
// GPIO47 (Y3)   -> LORA_TXEN
// GPIO48 (Y4)   -> LORA_RXEN
// GPIO41 (PCLK) -> LORA_SCK

// ============================================================================
// Rotary Encoder (Volume Encoder Module - 3D Printable Parts)
// ============================================================================
#define PIN_ENCODER_CLK        GPIO_NUM_17  // Clock signal (interrupt capable)
#define PIN_ENCODER_DT         GPIO_NUM_18  // Data signal (interrupt capable)
#define PIN_ENCODER_SW         GPIO_NUM_NC  // Switch/button (optional, not used by default)

// GPIO17 (VSYNC) and GPIO18 (HREF) are now used for rotary encoder
// MCP23017 interrupt uses GPIO46 (PIN_MCP23017_INT)

// ============================================================================
// GPIO Availability Summary
// ============================================================================
// Used: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 19, 20, 21,
//       38, 39, 40, 41, 42, 45, 46, 47, 48
// Free: 17, 18 (expansion header UART or MCP23017 INT)
// Internal (unavailable): 26-32 (flash), 33-37 (PSRAM)

#endif // PIN_CONFIG_H
