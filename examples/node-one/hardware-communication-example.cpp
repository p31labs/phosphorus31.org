/**
 * Node One Hardware Communication Example
 * 
 * ESP32-S3 code for Node One hardware communication.
 * 
 * 💜 With love and light. As above, so below. 💜
 */

#include <WiFi.h>
#include <LoRa.h>
#include <Wire.h>

// Whale Channel Configuration
#define LORA_FREQUENCY 915E6
#define LORA_CS_PIN 12
#define LORA_RST_PIN 14
#define LORA_DIO0_PIN 2

// The Thick Click (Haptic)
#define HAPTIC_PIN 6

// I2C Configuration
#define I2C_SDA 8
#define I2C_SCL 7

// Message structure for Whale Channel
struct MeshMessage {
  uint8_t nodeId;
  uint8_t messageType;
  char payload[256];
  uint32_t timestamp;
};

/**
 * Initialize Node One hardware
 */
void setup() {
  Serial.begin(115200);
  
  // Initialize I2C
  Wire.begin(I2C_SDA, I2C_SCL);
  
  // Initialize LoRa (Whale Channel)
  LoRa.setPins(LORA_CS_PIN, LORA_RST_PIN, LORA_DIO0_PIN);
  if (!LoRa.begin(LORA_FREQUENCY)) {
    Serial.println("LoRa init failed!");
    while (1);
  }
  
  Serial.println("🔺 Node One initialized");
  Serial.println("💜 With love and light. As above, so below. 💜");
}

/**
 * Send message via Whale Channel
 */
void sendToMesh(const char* message) {
  LoRa.beginPacket();
  LoRa.print(message);
  LoRa.endPacket();
  
  // Haptic feedback (The Thick Click)
  digitalWrite(HAPTIC_PIN, HIGH);
  delay(50);
  digitalWrite(HAPTIC_PIN, LOW);
}

/**
 * Receive message from Whale Channel
 */
void receiveFromMesh() {
  int packetSize = LoRa.parsePacket();
  if (packetSize) {
    String message = "";
    while (LoRa.available()) {
      message += (char)LoRa.read();
    }
    
    Serial.print("Received: ");
    Serial.println(message);
    
    // Haptic feedback
    digitalWrite(HAPTIC_PIN, HIGH);
    delay(100);
    digitalWrite(HAPTIC_PIN, LOW);
  }
}

/**
 * Main loop
 */
void loop() {
  // Send heartbeat
  static unsigned long lastHeartbeat = 0;
  if (millis() - lastHeartbeat > 60000) {
    sendToMesh("PING");
    lastHeartbeat = millis();
  }
  
  // Receive messages
  receiveFromMesh();
  
  delay(100);
}
