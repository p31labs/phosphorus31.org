// ============================================
// NODE ONE PIN MAP — ESP32-S3-Touch-LCD-3.5B
// Auto-extracted from Waveshare demo + xiaozhi
// Version B — Verified pin assignments
// ============================================

#pragma once

#include "driver/gpio.h"

// === I2C BUS (shared by all onboard sensors) ===
#define BSP_I2C_SDA        GPIO_NUM_8
#define BSP_I2C_SCL        GPIO_NUM_7

// === QSPI DISPLAY (AXS15231B) ===
#define LCD_QSPI_CS        GPIO_NUM_12
#define LCD_QSPI_CLK       GPIO_NUM_5
#define LCD_QSPI_D0        GPIO_NUM_1
#define LCD_QSPI_D1        GPIO_NUM_2
#define LCD_QSPI_D2        GPIO_NUM_3
#define LCD_QSPI_D3        GPIO_NUM_4
#define LCD_RST             GPIO_NUM_NC  // Managed by AXP2101
#define LCD_BL              GPIO_NUM_6   // Backlight (LEDC PWM)
#define LCD_TE              GPIO_NUM_NC  // Tearing effect, not used

// === I2S AUDIO (ES8311) ===
#define I2S_MCLK           GPIO_NUM_44
#define I2S_BCLK           GPIO_NUM_13
#define I2S_LRCK           GPIO_NUM_15
#define I2S_DOUT           GPIO_NUM_16
#define I2S_DIN            GPIO_NUM_14

// === SD CARD ===
#define SD_CLK             GPIO_NUM_11
#define SD_CMD             GPIO_NUM_10
#define SD_D0              GPIO_NUM_9

// === CAMERA (NOT USED — pins available for LoRa) ===
#define CAM_XCLK           GPIO_NUM_38
#define CAM_Y9             GPIO_NUM_21
#define CAM_Y8             GPIO_NUM_39
#define CAM_Y7             GPIO_NUM_40
#define CAM_Y6             GPIO_NUM_42
#define CAM_Y5             GPIO_NUM_46
#define CAM_Y4             GPIO_NUM_48
#define CAM_Y3             GPIO_NUM_47
#define CAM_Y2             GPIO_NUM_45
#define CAM_VSYNC          GPIO_NUM_17
#define CAM_HREF           GPIO_NUM_18
#define CAM_PCLK           GPIO_NUM_41

// === LORA MODULE (E22-900M30S via SX1262) ===
// Using freed camera pins
#define PIN_LORA_SCK       GPIO_NUM_41  // CAM_PCLK
#define PIN_LORA_MISO      GPIO_NUM_39  // CAM_Y8
#define PIN_LORA_MOSI      GPIO_NUM_42  // CAM_Y6
#define PIN_LORA_NSS       GPIO_NUM_40  // CAM_Y7
#define PIN_LORA_DIO1      GPIO_NUM_38  // CAM_XCLK
#define PIN_LORA_NRST      GPIO_NUM_45  // CAM_Y2
#define PIN_LORA_BUSY      GPIO_NUM_21  // CAM_Y9
#define PIN_LORA_TXEN      GPIO_NUM_47  // CAM_Y3
#define PIN_LORA_RXEN      GPIO_NUM_48  // CAM_Y4

// === MCP23017 I2C GPIO EXPANDER ===
#define MCP_INT_PIN        GPIO_NUM_46  // CAM_Y5 (or GPIO17/18 if rotary encoder not used)
#define PIN_MCP23017_INT   GPIO_NUM_46  // Alias for compatibility

// === BUTTONS ===
#define BOOT_BUTTON        GPIO_NUM_0

// === USB ===
#define USB_DM             GPIO_NUM_19
#define USB_DP             GPIO_NUM_20

// === ROTARY ENCODER (Optional) ===
#define ENCODER_CLK        GPIO_NUM_17  // CAM_VSYNC (if not using MCP23017 INT)
#define ENCODER_DT         GPIO_NUM_18  // CAM_HREF

// ============================================
// FREE GPIO SUMMARY
// ============================================
// Camera pins allocated to LoRa: 38, 21, 39, 40, 42, 45, 47, 48, 41
// GPIO17/18 available for rotary encoder or MCP23017 interrupt
// GPIO46 available for MCP23017 interrupt if encoder uses 17/18
// Internal (unavailable): 26-32 (flash), 33-37 (PSRAM)
