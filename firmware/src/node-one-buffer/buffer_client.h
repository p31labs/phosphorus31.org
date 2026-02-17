/**
 * Node One - Buffer Client Header
 * C++ interface for The Buffer API
 */

#ifndef NODE_ONE_BUFFER_CLIENT_H
#define NODE_ONE_BUFFER_CLIENT_H

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

class BufferClient {
private:
  String bufferUrl;
  String nodeId;
  int lastSignalStrength;
  
public:
  BufferClient(const char* url, const char* id);
  
  // Send heartbeat to The Buffer
  bool sendHeartbeat(int signalStrength);
  
  // Submit message to The Buffer
  bool submitMessage(const char* message, const char* priority = "normal");
  
  // Get queue status
  bool getQueueStatus(int& queueLength, bool& connected);
  
  // Get ping status
  bool getPingStatus(String& health);
  
  // Check if Buffer is available
  bool isAvailable();
};

#endif
