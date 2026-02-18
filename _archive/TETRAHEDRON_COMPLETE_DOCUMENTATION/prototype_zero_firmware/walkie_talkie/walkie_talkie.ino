/*
 * PROTOTYPE-ZERO: Walkie-Talkie Edition
 * Build Date: December 15th, 2024
 * 
 * What This Does:
 * - Sends messages between two devices using LoRa radio
 * - Shows messages on screen
 * - LEDs react when receiving messages
 * - Buttons send pre-programmed quick messages
 * 
 * Hardware:
 * - Adafruit ESP32-S3 Feather (SKU 4883)
 * - RFM95W LoRa FeatherWing (SKU 3231)
 * - 2.8" TFT Touch Screen (SKU 1770)
 * - NeoPixel LED Strip (SKU 1376)
 * - 4× Arcade Buttons connected to pins 9, 10, 11, 12
 * 
 * SETUP INSTRUCTIONS:
 * 1. Upload this to BOTH devices
 * 2. Set DEVICE_ID to 1 on the first device (Dad)
 * 3. Set DEVICE_ID to 2 on the second device (Son)
 * 4. Power them on and press buttons to send messages!
 */

#include <SPI.h>
#include <RH_RF95.h>
#include <Adafruit_GFX.h>
#include <Adafruit_ILI9341.h>
#include <Adafruit_NeoPixel.h>

// ===== CUSTOMIZE THIS SECTION =====
#define DEVICE_ID 1  // ← CHANGE TO 1 FOR DAD, 2 FOR SON

const char* MY_NAME = (DEVICE_ID == 1) ? "DAD" : "SON";
const char* THEIR_NAME = (DEVICE_ID == 1) ? "SON" : "DAD";
// ==================================

// Pin assignments
#define TFT_CS   7
#define TFT_DC   39
#define TFT_RST  40

#define RFM95_CS   6
#define RFM95_INT  8
#define RFM95_RST  38

#define LED_PIN    5
#define LED_COUNT  20

#define BTN1_PIN   9   // Blue button - "Hi!"
#define BTN2_PIN   10  // Red button - "Come here"
#define BTN3_PIN   11  // Green button - "On my way"
#define BTN4_PIN   12  // Yellow button - "You're awesome"

// Radio frequency (must match on both devices)
#define RF95_FREQ 915.0

// Create objects
RH_RF95 rf95(RFM95_CS, RFM95_INT);
Adafruit_ILI9341 tft = Adafruit_ILI9341(TFT_CS, TFT_DC, TFT_RST);
Adafruit_NeoPixel strip(LED_COUNT, LED_PIN, NEO_GRB + NEO_KHZ800);

// Message history (last 8 messages)
#define MAX_MESSAGES 8
String messages[MAX_MESSAGES];
int messageCount = 0;

// Quick messages assigned to buttons
const char* quickMessages[] = {
  "Hi! 👋",
  "Come here 🏃",
  "On my way! 🚀",
  "You're awesome! ⭐"
};

// Colors
#define COLOR_BLACK   0x0000
#define COLOR_BLUE    0x001F
#define COLOR_GREEN   0x07E0
#define COLOR_CYAN    0x07FF
#define COLOR_RED     0xF800
#define COLOR_YELLOW  0xFFE0
#define COLOR_WHITE   0xFFFF
#define COLOR_GRAY    0x7BEF

void setup() {
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("========================================");
  Serial.println("  PROTOTYPE-ZERO: WALKIE-TALKIE");
  Serial.println("========================================");
  Serial.print("  I am: ");
  Serial.println(MY_NAME);
  Serial.print("  Talking to: ");
  Serial.println(THEIR_NAME);
  Serial.println("========================================");
  
  // Initialize buttons
  pinMode(BTN1_PIN, INPUT_PULLUP);
  pinMode(BTN2_PIN, INPUT_PULLUP);
  pinMode(BTN3_PIN, INPUT_PULLUP);
  pinMode(BTN4_PIN, INPUT_PULLUP);
  
  // Initialize screen
  Serial.println("Starting screen...");
  tft.begin();
  tft.setRotation(1);
  tft.fillScreen(COLOR_BLACK);
  drawUI();
  
  // Initialize LEDs
  Serial.println("Starting LEDs...");
  strip.begin();
  strip.setBrightness(50);
  strip.show();
  
  // Initialize LoRa radio
  Serial.println("Starting radio...");
  pinMode(RFM95_RST, OUTPUT);
  digitalWrite(RFM95_RST, HIGH);
  delay(10);
  digitalWrite(RFM95_RST, LOW);
  delay(10);
  digitalWrite(RFM95_RST, HIGH);
  delay(10);
  
  if (!rf95.init()) {
    Serial.println("ERROR: LoRa radio init failed!");
    tft.setTextColor(COLOR_RED);
    tft.setTextSize(2);
    tft.setCursor(10, 100);
    tft.println("RADIO ERROR!");
    tft.println("Check wiring");
    while (1) {
      flashError();
    }
  }
  
  if (!rf95.setFrequency(RF95_FREQ)) {
    Serial.println("ERROR: setFrequency failed");
    while (1);
  }
  
  // Set transmit power (5-23 dBm)
  rf95.setTxPower(23, false);
  
  Serial.println("Radio ready!");
  
  // Success animation
  successAnimation();
  
  // Add welcome message
  addMessage("System: Ready!");
  drawMessages();
}

void loop() {
  // Check for button presses
  if (digitalRead(BTN1_PIN) == LOW) {
    sendMessage(quickMessages[0]);
    delay(300); // Debounce
  }
  if (digitalRead(BTN2_PIN) == LOW) {
    sendMessage(quickMessages[1]);
    delay(300);
  }
  if (digitalRead(BTN3_PIN) == LOW) {
    sendMessage(quickMessages[2]);
    delay(300);
  }
  if (digitalRead(BTN4_PIN) == LOW) {
    sendMessage(quickMessages[3]);
    delay(300);
  }
  
  // Check for incoming messages
  if (rf95.available()) {
    receiveMessage();
  }
  
  // Idle LED animation (gentle pulse)
  idlePulse();
}

// ===== RADIO FUNCTIONS =====

void sendMessage(const char* msg) {
  Serial.print("Sending: ");
  Serial.println(msg);
  
  // Format: "[SENDER] message"
  char packet[100];
  snprintf(packet, sizeof(packet), "[%s] %s", MY_NAME, msg);
  
  // Send via LoRa
  rf95.send((uint8_t *)packet, strlen(packet));
  rf95.waitPacketSent();
  
  // Visual feedback
  sendAnimation();
  
  // Add to message history
  addMessage(packet);
  drawMessages();
}

void receiveMessage() {
  uint8_t buf[RH_RF95_MAX_MESSAGE_LEN];
  uint8_t len = sizeof(buf);
  
  if (rf95.recv(buf, &len)) {
    buf[len] = 0; // Null terminate
    
    Serial.print("Received: ");
    Serial.println((char*)buf);
    Serial.print("RSSI: ");
    Serial.println(rf95.lastRssi());
    
    // Visual feedback
    receiveAnimation();
    
    // Add to message history
    addMessage((char*)buf);
    drawMessages();
  }
}

// ===== UI FUNCTIONS =====

void drawUI() {
  tft.fillScreen(COLOR_BLACK);
  
  // Title bar
  tft.fillRect(0, 0, 320, 30, COLOR_BLUE);
  tft.setTextColor(COLOR_WHITE);
  tft.setTextSize(2);
  tft.setCursor(10, 8);
  tft.print("Walkie-Talkie: ");
  tft.print(MY_NAME);
  
  // Button legend at bottom
  tft.setTextSize(1);
  tft.setTextColor(COLOR_GRAY);
  tft.setCursor(5, 225);
  tft.print("Blue:Hi Red:Come Green:OMW Yellow:Cool");
  
  // Message area separator
  tft.drawLine(0, 35, 320, 35, COLOR_GRAY);
}

void drawMessages() {
  // Clear message area
  tft.fillRect(0, 36, 320, 188, COLOR_BLACK);
  
  // Draw messages (newest at bottom)
  tft.setTextSize(1);
  int y = 40;
  int startIdx = (messageCount > MAX_MESSAGES) ? messageCount - MAX_MESSAGES : 0;
  
  for (int i = startIdx; i < messageCount && i < startIdx + MAX_MESSAGES; i++) {
    // Color code: messages from me vs them
    if (messages[i].startsWith("[" + String(MY_NAME) + "]")) {
      tft.setTextColor(COLOR_CYAN);
    } else {
      tft.setTextColor(COLOR_GREEN);
    }
    
    tft.setCursor(5, y);
    tft.println(messages[i]);
    y += 20;
  }
}

void addMessage(String msg) {
  if (messageCount < 100) { // Prevent overflow
    messages[messageCount] = msg;
    messageCount++;
  }
}

// ===== ANIMATIONS =====

void successAnimation() {
  // Green checkmark effect
  for (int i = 0; i < LED_COUNT; i++) {
    strip.setPixelColor(i, strip.Color(0, 255, 0));
    strip.show();
    delay(30);
  }
  delay(500);
  strip.clear();
  strip.show();
}

void sendAnimation() {
  // Blue wave going outward
  for (int pass = 0; pass < 3; pass++) {
    for (int i = 0; i < LED_COUNT; i++) {
      strip.clear();
      strip.setPixelColor(i, strip.Color(0, 0, 255));
      if (i > 0) strip.setPixelColor(i - 1, strip.Color(0, 0, 100));
      strip.show();
      delay(20);
    }
  }
  strip.clear();
  strip.show();
}

void receiveAnimation() {
  // Green flash
  for (int brightness = 0; brightness < 255; brightness += 15) {
    for (int i = 0; i < LED_COUNT; i++) {
      strip.setPixelColor(i, strip.Color(0, brightness, 0));
    }
    strip.show();
    delay(10);
  }
  for (int brightness = 255; brightness > 0; brightness -= 15) {
    for (int i = 0; i < LED_COUNT; i++) {
      strip.setPixelColor(i, strip.Color(0, brightness, 0));
    }
    strip.show();
    delay(10);
  }
  strip.clear();
  strip.show();
}

void flashError() {
  // Red SOS pattern
  for (int i = 0; i < LED_COUNT; i++) {
    strip.setPixelColor(i, strip.Color(255, 0, 0));
  }
  strip.show();
  delay(200);
  strip.clear();
  strip.show();
  delay(200);
}

void idlePulse() {
  static uint8_t brightness = 0;
  static int8_t direction = 1;
  
  brightness += direction;
  if (brightness == 0 || brightness == 50) {
    direction = -direction;
  }
  
  // Just light up the first LED with gentle pulse
  strip.setPixelColor(0, strip.Color(0, 0, brightness));
  strip.show();
  delay(20);
}
