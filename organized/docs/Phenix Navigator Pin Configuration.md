/*
 * PHENIX NAVIGATOR - HARDWARE CONFIGURATION FILE
 * AUTHOR: W. JOHNSON / TRF
 * DATE: DEC 2025
 * OBJECTIVE: Map all hardware controls (Rocker, Encoder, Switches) to ESP32-S3 GPIO pins
 * based on the final 145mm x 75mm symmetrical chassis design.
 */

#ifndef CONFIG_PHENIX_NAVIGATOR_H
#define CONFIG_PHENIX_NAVIGATOR_H

// --- 1. POWER & OUTPUTS ---

// WS2812B LED Strip for Status Bar (Critical for Hysteresis visualization)
// Used for LOAD (Color change) and CRITICAL ALARM (Urgent Red Pulse)
#define PIN_LED_STRIP          5         // GPIO 5 - Connected to Data Line of WS2812B strip

// E-STOP Button
// This is physically wired to cut the battery line to the board (Hard Shutdown).
// No software pin required for the hard cut, but we reserve one for status monitoring.
#define PIN_E_STOP_STATUS      16        // GPIO 16 (Optional: For reading power state)

// LoRa Radio (Ebyte E22 - SPI Interface)
// Based on standard Meshtastic SPI pinout for ESP32-S3
#define LORA_CS_PIN            9
#define LORA_RST_PIN           10
#define LORA_DIO_PIN           11        // DIO pin for interrupt
#define LORA_BUSY_PIN          12
#define LORA_MOSI_PIN          13
#define LORA_MISO_PIN          14
#define LORA_SCK_PIN           15

// --- 2. LEFT SIDE CONTROLS (Navigation/Coarse Adjustment) ---

// Mini Rocker Switch (Up/Down Navigation for Menu)
// LEFT SIDE TOP - Used for Coarse Load Adjustment / Menu Navigation
#define PIN_ROCKER_UP          18        // GPIO 18 (Rocker Up/Load Increase)
#define PIN_ROCKER_DOWN        17        // GPIO 17 (Rocker Down/Load Decrease)

// --- 3. RIGHT SIDE CONTROLS (Selection/Fine Adjustment) ---

// EC11 Rotary Encoder (Scroll/Fine-tuning)
// RIGHT SIDE TOP - Used for Fine Load Adjustment / Value Selection
#define PIN_ENCODER_A          40        // GPIO 40 (Encoder Phase A)
#define PIN_ENCODER_B          41        // GPIO 41 (Encoder Phase B)

// --- 4. BOTTOM MECHANICAL SWITCHES (Analog Resistor Ladder for Low Pin Count) ---

// The four mechanical switches (Red, Green, L-Trigger, R-Trigger) are wired
// in series with different resistors to a single ADC pin (GPIO 4) to conserve pins.
// This is a classic hardware solution for low-power, high-reliability I/O.
#define PIN_ADC_SWITCHES       4         // GPIO 4 (ADC input)

// ADC Thresholds (Approximate readings based on 3.3V reference and 12-bit ADC range 0-4095)
// Resistor values from your design: 1KΩ, 2.2KΩ, 4.7KΩ, 10KΩ (plus pull-down/up)
#define THRESHOLD_GREEN_ENTER  500       // Green (Enter) - 1KΩ
#define THRESHOLD_RED_BACK     1000      // Red (Back) - 2.2KΩ
#define THRESHOLD_L_TRIGGER    1800      // L-Trigger (Panic/Quick Send) - 4.7KΩ
#define THRESHOLD_R_TRIGGER    3000      // R-Trigger (Menu/Settings) - 10KΩ

// Mapping of ADC Reads to Functions:
// Green Switch: Enter/Commit Status (Positive Action)
// Red Switch: Back/Cancel Check-in (Negative Action)
// L-Trigger: Panic Ping (Critical Load Signal)
// R-Trigger: Menu Open (Configuration/Setup)

// --- 5. DISPLAY (Waveshare 3.5" Touch) ---

// Assuming parallel interface standard for Meshtastic/TFT_eSPI library
// The exact pins are handled by the Meshtastic build environment, but kept here for reference
// #define PIN_LCD_BL             46        // Backlight
// ... other LCD pins ...

#endif // CONFIG_PHENIX_NAVIGATOR_H