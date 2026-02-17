/**
 * Node One - Buffer Client Implementation
 */

#include "buffer_client.h"

BufferClient::BufferClient(const char* url, const char* id) {
  bufferUrl = String(url);
  nodeId = String(id);
  lastSignalStrength = 0;
}

bool BufferClient::sendHeartbeat(int signalStrength) {
  if (WiFi.status() != WL_CONNECTED) {
    return false;
  }
  
  HTTPClient http;
  http.begin(bufferUrl + "/api/ping/heartbeat");
  http.addHeader("Content-Type", "application/json");
  
  StaticJsonDocument<200> doc;
  doc["nodeId"] = nodeId;
  doc["signalStrength"] = signalStrength;
  
  String payload;
  serializeJson(doc, payload);
  
  int httpResponseCode = http.POST(payload);
  http.end();
  
  lastSignalStrength = signalStrength;
  return httpResponseCode == 200;
}

bool BufferClient::submitMessage(const char* message, const char* priority) {
  if (WiFi.status() != WL_CONNECTED) {
    return false;
  }
  
  HTTPClient http;
  http.begin(bufferUrl + "/api/messages");
  http.addHeader("Content-Type", "application/json");
  
  StaticJsonDocument<300> doc;
  doc["message"] = message;
  doc["priority"] = priority;
  doc["metadata"]["source"] = "node_one";
  doc["metadata"]["timestamp"] = millis();
  
  String payload;
  serializeJson(doc, payload);
  
  int httpResponseCode = http.POST(payload);
  http.end();
  
  return httpResponseCode == 200;
}

bool BufferClient::getQueueStatus(int& queueLength, bool& connected) {
  if (WiFi.status() != WL_CONNECTED) {
    return false;
  }
  
  HTTPClient http;
  http.begin(bufferUrl + "/api/queue/status");
  
  int httpResponseCode = http.GET();
  
  if (httpResponseCode == 200) {
    String response = http.getString();
    StaticJsonDocument<200> doc;
    deserializeJson(doc, response);
    
    queueLength = doc["queueLength"] | 0;
    connected = doc["connected"] | false;
    
    http.end();
    return true;
  }
  
  http.end();
  return false;
}

bool BufferClient::getPingStatus(String& health) {
  if (WiFi.status() != WL_CONNECTED) {
    return false;
  }
  
  HTTPClient http;
  http.begin(bufferUrl + "/api/ping/status");
  
  int httpResponseCode = http.GET();
  
  if (httpResponseCode == 200) {
    String response = http.getString();
    StaticJsonDocument<200> doc;
    deserializeJson(doc, response);
    
    health = doc["health"] | "unknown";
    
    http.end();
    return true;
  }
  
  http.end();
  return false;
}

bool BufferClient::isAvailable() {
  if (WiFi.status() != WL_CONNECTED) {
    return false;
  }
  
  HTTPClient http;
  http.begin(bufferUrl + "/health");
  http.setTimeout(2000);
  
  int httpResponseCode = http.GET();
  http.end();
  
  return httpResponseCode == 200;
}
