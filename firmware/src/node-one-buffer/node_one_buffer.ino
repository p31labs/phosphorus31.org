/**
 * Node One - Buffer Integration
 * ESP32-S3 firmware for sending heartbeats to The Buffer
 * 
 * Features:
 * - WiFi connection to The Buffer API
 * - LoRa mesh heartbeat (Whale Channel)
 * - Haptic feedback (The Thick Click)
 * - Display status updates
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// Configuration
const char* WIFI_SSID = "YOUR_WIFI_SSID";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";
const char* BUFFER_URL = "http://192.168.1.100:4000"; // The Buffer API URL
const char* NODE_ID = "node_one";

// Whale Channel (LoRa) - placeholder for actual LoRa implementation
// #include <LoRa.h>

// Heartbeat interval (30 seconds)
const unsigned long HEARTBEAT_INTERVAL = 30000;
unsigned long lastHeartbeat = 0;

// Signal strength (RSSI for WiFi, SNR for LoRa)
int signalStrength = 0;

void setup() {
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("Node One - Buffer Integration");
  Serial.println("P31 Hardware Device");
  
  // Initialize WiFi
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println();
  Serial.print("Connected! IP: ");
  Serial.println(WiFi.localIP());
  
  // Initialize Whale Channel (LoRa) - placeholder
  // LoRa.begin(915E6);
  
  // Initialize The Thick Click (haptic) - placeholder
  // initializeHaptics();
  
  // Send initial heartbeat
  sendHeartbeat();
}

void loop() {
  unsigned long currentMillis = millis();
  
  // Send heartbeat every 30 seconds
  if (currentMillis - lastHeartbeat >= HEARTBEAT_INTERVAL) {
    sendHeartbeat();
    lastHeartbeat = currentMillis;
  }
  
  // Check WiFi connection
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi disconnected, reconnecting...");
    WiFi.reconnect();
  }
  
  // Process Whale Channel messages (placeholder)
  // processWhaleChannel();
  
  delay(1000);
}

/**
 * Send heartbeat to The Buffer
 */
void sendHeartbeat() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi not connected, skipping heartbeat");
    return;
  }
  
  // Calculate signal strength (WiFi RSSI)
  signalStrength = WiFi.RSSI();
  // Convert RSSI (-100 to 0) to percentage (0 to 100)
  int signalPercent = map(signalStrength, -100, 0, 0, 100);
  signalPercent = constrain(signalPercent, 0, 100);
  
  HTTPClient http;
  http.begin(String(BUFFER_URL) + "/api/ping/heartbeat");
  http.addHeader("Content-Type", "application/json");
  
  // Create JSON payload
  StaticJsonDocument<200> doc;
  doc["nodeId"] = NODE_ID;
  doc["signalStrength"] = signalPercent;
  
  String payload;
  serializeJson(doc, payload);
  
  int httpResponseCode = http.POST(payload);
  
  if (httpResponseCode > 0) {
    Serial.print("Heartbeat sent: ");
    Serial.println(httpResponseCode);
    
    String response = http.getString();
    Serial.println("Response: " + response);
  } else {
    Serial.print("Heartbeat failed: ");
    Serial.println(httpResponseCode);
  }
  
  http.end();
}

/**
 * Submit message to The Buffer
 */
void submitToBuffer(String message, String priority = "normal") {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi not connected, cannot submit message");
    return;
  }
  
  HTTPClient http;
  http.begin(String(BUFFER_URL) + "/api/messages");
  http.addHeader("Content-Type", "application/json");
  
  StaticJsonDocument<300> doc;
  doc["message"] = message;
  doc["priority"] = priority;
  doc["metadata"]["source"] = "node_one";
  doc["metadata"]["timestamp"] = millis();
  
  String payload;
  serializeJson(doc, payload);
  
  int httpResponseCode = http.POST(payload);
  
  if (httpResponseCode > 0) {
    Serial.print("Message submitted: ");
    Serial.println(httpResponseCode);
  } else {
    Serial.print("Message submission failed: ");
    Serial.println(httpResponseCode);
  }
  
  http.end();
}

/**
 * Get Buffer queue status
 */
void getBufferStatus() {
  if (WiFi.status() != WL_CONNECTED) {
    return;
  }
  
  HTTPClient http;
  http.begin(String(BUFFER_URL) + "/api/queue/status");
  
  int httpResponseCode = http.GET();
  
  if (httpResponseCode > 0) {
    String response = http.getString();
    Serial.println("Buffer Status: " + response);
    
    // Parse and display on screen if needed
    // displayBufferStatus(response);
  }
  
  http.end();
}
