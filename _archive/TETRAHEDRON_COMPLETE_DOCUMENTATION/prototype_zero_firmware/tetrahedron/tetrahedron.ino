/*
 * TETRAHEDRON PROTOCOL v1.0
 * "The simplest structure in nature"
 * 
 * Network Architecture:
 * - 4 nodes, each directly connected to all others
 * - No routing, no hops, pure mesh
 * - Each node maintains awareness of network geometry
 * 
 * Node Assignment:
 * NODE 1 (BLUE)   = Dad
 * NODE 2 (GREEN)  = Son
 * NODE 3 (YELLOW) = Daughter
 * NODE 4 (PURPLE) = The Fourth
 * 
 * Protocol:
 * - Broadcast heartbeat every 5 seconds
 * - Track which nodes are online
 * - Direct messaging to any node
 * - Group broadcast to all nodes
 */

#include <SPI.h>
#include <RH_RF95.h>
#include <Adafruit_GFX.h>
#include <Adafruit_ILI9341.h>
#include <Adafruit_NeoPixel.h>

// ===== CRITICAL: SET THIS FOR EACH DEVICE =====
#define MY_NODE_ID 1  // 1=Dad, 2=Son, 3=Daughter, 4=Fourth
// ==============================================

// Node definitions
struct Node {
  uint8_t id;
  const char* name;
  uint16_t color;
  bool online;
  unsigned long lastSeen;
  int lastRSSI;
};

Node nodes[4] = {
  {1, "DAD",      0x001F, false, 0, 0},  // Blue
  {2, "SON",      0x07E0, false, 0, 0},  // Green
  {3, "DAUGHTER", 0xFFE0, false, 0, 0},  // Yellow
  {4, "FOURTH",   0xF81F, false, 0, 0}   // Purple
};

Node* me = &nodes[MY_NODE_ID - 1];

// Pin assignments
#define TFT_CS   7
#define TFT_DC   39
#define TFT_RST  40
#define RFM95_CS   6
#define RFM95_INT  8
#define RFM95_RST  38
#define LED_PIN    5
#define LED_COUNT  20

// Four buttons - one for each node
#define BTN_NODE1  9   // Send to Dad
#define BTN_NODE2  10  // Send to Son
#define BTN_NODE3  11  // Send to Daughter
#define BTN_NODE4  12  // Send to Fourth

#define RF95_FREQ 915.0

// Objects
RH_RF95 rf95(RFM95_CS, RFM95_INT);
Adafruit_ILI9341 tft = Adafruit_ILI9341(TFT_CS, TFT_DC, TFT_RST);
Adafruit_NeoPixel strip(LED_COUNT, LED_PIN, NEO_GRB + NEO_KHZ800);

// Message protocol
#define MSG_HEARTBEAT  0x01
#define MSG_DIRECT     0x02
#define MSG_BROADCAST  0x03
#define MSG_ACK        0x04

struct Packet {
  uint8_t type;
  uint8_t fromNode;
  uint8_t toNode;
  char payload[90];
};

// State
#define MAX_HISTORY 10
String messageHistory[MAX_HISTORY];
int historyCount = 0;
unsigned long lastHeartbeat = 0;
unsigned long lastStatusUpdate = 0;
bool structureComplete = false;

// Colors
#define COLOR_BLACK   0x0000
#define COLOR_WHITE   0xFFFF
#define COLOR_GRAY    0x7BEF
#define COLOR_RED     0xF800

void setup() {
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("╔════════════════════════════════════════╗");
  Serial.println("║   TETRAHEDRON PROTOCOL - INITIALIZING  ║");
  Serial.println("╚════════════════════════════════════════╝");
  Serial.print("  My Node: ");
  Serial.print(MY_NODE_ID);
  Serial.print(" (");
  Serial.print(me->name);
  Serial.println(")");
  Serial.println("  Waiting for network structure...");
  
  // Initialize hardware
  pinMode(BTN_NODE1, INPUT_PULLUP);
  pinMode(BTN_NODE2, INPUT_PULLUP);
  pinMode(BTN_NODE3, INPUT_PULLUP);
  pinMode(BTN_NODE4, INPUT_PULLUP);
  
  tft.begin();
  tft.setRotation(1);
  tft.fillScreen(COLOR_BLACK);
  
  strip.begin();
  strip.setBrightness(80);
  strip.show();
  
  // Initialize LoRa
  pinMode(RFM95_RST, OUTPUT);
  digitalWrite(RFM95_RST, HIGH);
  delay(10);
  digitalWrite(RFM95_RST, LOW);
  delay(10);
  digitalWrite(RFM95_RST, HIGH);
  delay(10);
  
  if (!rf95.init() || !rf95.setFrequency(RF95_FREQ)) {
    Serial.println("ERROR: Radio init failed");
    showError("RADIO FAILURE");
    while(1) delay(1000);
  }
  
  rf95.setTxPower(23, false);
  
  // Mark myself as online
  me->online = true;
  me->lastSeen = millis();
  
  // Boot animation
  bootSequence();
  
  // Send initial heartbeat
  sendHeartbeat();
  
  drawUI();
}

void loop() {
  unsigned long now = millis();
  
  // Send heartbeat every 5 seconds
  if (now - lastHeartbeat > 5000) {
    sendHeartbeat();
    lastHeartbeat = now;
  }
  
  // Check for incoming packets
  if (rf95.available()) {
    receivePacket();
  }
  
  // Update node status (mark offline if no heartbeat)
  if (now - lastStatusUpdate > 1000) {
    updateNodeStatus();
    lastStatusUpdate = now;
    drawNodeStatus();
  }
  
  // Check buttons
  checkButtons();
  
  // Update LEDs to show network structure
  updateStructureLEDs();
  
  delay(50);
}

// ===== PROTOCOL FUNCTIONS =====

void sendHeartbeat() {
  Packet pkt;
  pkt.type = MSG_HEARTBEAT;
  pkt.fromNode = MY_NODE_ID;
  pkt.toNode = 0; // Broadcast
  snprintf(pkt.payload, sizeof(pkt.payload), "HEARTBEAT");
  
  rf95.send((uint8_t*)&pkt, sizeof(pkt));
  rf95.waitPacketSent();
  
  Serial.println("→ Heartbeat sent");
}

void sendDirectMessage(uint8_t toNode, const char* msg) {
  Packet pkt;
  pkt.type = MSG_DIRECT;
  pkt.fromNode = MY_NODE_ID;
  pkt.toNode = toNode;
  snprintf(pkt.payload, sizeof(pkt.payload), "%s", msg);
  
  rf95.send((uint8_t*)&pkt, sizeof(pkt));
  rf95.waitPacketSent();
  
  Serial.print("→ Direct to Node ");
  Serial.print(toNode);
  Serial.print(": ");
  Serial.println(msg);
  
  // Add to history
  char history[100];
  snprintf(history, sizeof(history), "[%s→%s] %s", 
           me->name, nodes[toNode-1].name, msg);
  addToHistory(history);
  
  sendAnimation(nodes[toNode-1].color);
}

void sendBroadcast(const char* msg) {
  Packet pkt;
  pkt.type = MSG_BROADCAST;
  pkt.fromNode = MY_NODE_ID;
  pkt.toNode = 0;
  snprintf(pkt.payload, sizeof(pkt.payload), "%s", msg);
  
  rf95.send((uint8_t*)&pkt, sizeof(pkt));
  rf95.waitPacketSent();
  
  Serial.print("→ Broadcast: ");
  Serial.println(msg);
  
  char history[100];
  snprintf(history, sizeof(history), "[%s→ALL] %s", me->name, msg);
  addToHistory(history);
  
  broadcastAnimation();
}

void receivePacket() {
  Packet pkt;
  uint8_t len = sizeof(pkt);
  
  if (rf95.recv((uint8_t*)&pkt, &len)) {
    int rssi = rf95.lastRssi();
    
    // Ignore my own packets
    if (pkt.fromNode == MY_NODE_ID) return;
    
    // Update node status
    Node* sender = &nodes[pkt.fromNode - 1];
    sender->online = true;
    sender->lastSeen = millis();
    sender->lastRSSI = rssi;
    
    // Handle packet type
    switch(pkt.type) {
      case MSG_HEARTBEAT:
        Serial.print("← Heartbeat from Node ");
        Serial.print(pkt.fromNode);
        Serial.print(" RSSI: ");
        Serial.println(rssi);
        checkStructureComplete();
        break;
        
      case MSG_DIRECT:
        if (pkt.toNode == MY_NODE_ID || pkt.toNode == 0) {
          Serial.print("← Direct from ");
          Serial.print(sender->name);
          Serial.print(": ");
          Serial.println(pkt.payload);
          
          char history[100];
          snprintf(history, sizeof(history), "[%s→%s] %s", 
                   sender->name, me->name, pkt.payload);
          addToHistory(history);
          
          receiveAnimation(sender->color);
          drawMessages();
        }
        break;
        
      case MSG_BROADCAST:
        Serial.print("← Broadcast from ");
        Serial.print(sender->name);
        Serial.print(": ");
        Serial.println(pkt.payload);
        
        char history[100];
        snprintf(history, sizeof(history), "[%s→ALL] %s", 
                 sender->name, pkt.payload);
        addToHistory(history);
        
        receiveAnimation(sender->color);
        drawMessages();
        break;
    }
    
    drawNodeStatus();
  }
}

void updateNodeStatus() {
  unsigned long now = millis();
  
  for (int i = 0; i < 4; i++) {
    if (nodes[i].id == MY_NODE_ID) continue;
    
    // Mark offline if no heartbeat for 15 seconds
    if (nodes[i].online && (now - nodes[i].lastSeen > 15000)) {
      nodes[i].online = false;
      Serial.print("✗ Node ");
      Serial.print(nodes[i].id);
      Serial.println(" went offline");
      
      checkStructureComplete();
    }
  }
}

void checkStructureComplete() {
  bool wasComplete = structureComplete;
  
  structureComplete = true;
  for (int i = 0; i < 4; i++) {
    if (!nodes[i].online) {
      structureComplete = false;
      break;
    }
  }
  
  if (structureComplete && !wasComplete) {
    Serial.println("▲ STRUCTURE COMPLETE ▲");
    structureCompleteAnimation();
    addToHistory("*** TETRAHEDRON FORMED ***");
    drawMessages();
  } else if (!structureComplete && wasComplete) {
    Serial.println("▽ Structure broken ▽");
  }
}

// ===== BUTTON HANDLING =====

void checkButtons() {
  static unsigned long lastPress[4] = {0, 0, 0, 0};
  static bool allPressed = false;
  unsigned long now = millis();
  
  int btn[4] = {BTN_NODE1, BTN_NODE2, BTN_NODE3, BTN_NODE4};
  bool pressed[4];
  
  // Read all buttons
  for (int i = 0; i < 4; i++) {
    pressed[i] = (digitalRead(btn[i]) == LOW);
  }
  
  // Check if ALL buttons pressed (broadcast mode)
  if (pressed[0] && pressed[1] && pressed[2] && pressed[3]) {
    if (!allPressed) {
      allPressed = true;
      sendBroadcast("📣 GROUP MESSAGE!");
      delay(500);
    }
    return;
  }
  
  allPressed = false;
  
  // Check individual buttons (with debounce)
  for (int i = 0; i < 4; i++) {
    if (pressed[i] && (now - lastPress[i] > 300)) {
      lastPress[i] = now;
      
      if (i + 1 == MY_NODE_ID) {
        // Pressed my own button - easter egg!
        sendBroadcast("👋 Hi from me!");
      } else {
        // Send to specific node
        const char* quickMsgs[] = {"👋 Hi!", "🏃 Come here", "🚀 OMW!", "⭐ You rock!"};
        sendDirectMessage(i + 1, quickMsgs[i]);
      }
    }
  }
}

// ===== UI FUNCTIONS =====

void drawUI() {
  tft.fillScreen(COLOR_BLACK);
  
  // Title bar with my color
  tft.fillRect(0, 0, 320, 30, me->color);
  tft.setTextColor(COLOR_BLACK);
  tft.setTextSize(2);
  tft.setCursor(10, 8);
  tft.print("NODE ");
  tft.print(MY_NODE_ID);
  tft.print(": ");
  tft.print(me->name);
  
  // Node status area
  drawNodeStatus();
  
  // Message area
  drawMessages();
}

void drawNodeStatus() {
  // Clear status area
  tft.fillRect(0, 35, 320, 40, COLOR_BLACK);
  
  tft.setTextSize(1);
  
  for (int i = 0; i < 4; i++) {
    int x = 10 + (i * 75);
    int y = 40;
    
    // Draw node indicator
    if (nodes[i].online) {
      tft.fillCircle(x, y, 8, nodes[i].color);
      tft.setTextColor(nodes[i].color);
    } else {
      tft.drawCircle(x, y, 8, COLOR_GRAY);
      tft.setTextColor(COLOR_GRAY);
    }
    
    // Draw name
    tft.setCursor(x - 15, y + 12);
    tft.print(nodes[i].name);
    
    // Draw RSSI if online and not me
    if (nodes[i].online && i != MY_NODE_ID - 1) {
      tft.setCursor(x - 15, y + 22);
      tft.print(nodes[i].lastRSSI);
      tft.print("dB");
    }
  }
  
  // Structure status
  tft.setCursor(10, 65);
  if (structureComplete) {
    tft.setTextColor(0x07E0); // Green
    tft.print("▲ TETRAHEDRON COMPLETE");
  } else {
    tft.setTextColor(COLOR_GRAY);
    tft.print("▽ Waiting for nodes...");
  }
}

void drawMessages() {
  // Clear message area
  tft.fillRect(0, 80, 320, 140, COLOR_BLACK);
  
  tft.setTextSize(1);
  int y = 85;
  
  int start = (historyCount > 10) ? historyCount - 10 : 0;
  
  for (int i = start; i < historyCount; i++) {
    tft.setTextColor(COLOR_WHITE);
    tft.setCursor(5, y);
    tft.println(messageHistory[i]);
    y += 12;
  }
}

void addToHistory(const char* msg) {
  if (historyCount < MAX_HISTORY) {
    messageHistory[historyCount++] = String(msg);
  } else {
    // Shift array
    for (int i = 0; i < MAX_HISTORY - 1; i++) {
      messageHistory[i] = messageHistory[i + 1];
    }
    messageHistory[MAX_HISTORY - 1] = String(msg);
  }
}

// ===== LED ANIMATIONS =====

void updateStructureLEDs() {
  // Map LEDs to show structure
  // LEDs 0-4: Node 1, 5-9: Node 2, 10-14: Node 3, 15-19: Node 4
  
  for (int i = 0; i < 4; i++) {
    uint32_t color = nodes[i].online ? 
      strip.Color(
        (nodes[i].color >> 11) & 0x1F,
        (nodes[i].color >> 5) & 0x3F,
        nodes[i].color & 0x1F
      ) * 8 : 0;
    
    for (int j = 0; j < 5; j++) {
      strip.setPixelColor(i * 5 + j, color);
    }
  }
  
  strip.show();
}

void sendAnimation(uint16_t color) {
  // Pulse in target color
  for (int brightness = 0; brightness < 255; brightness += 15) {
    for (int i = 0; i < LED_COUNT; i++) {
      strip.setPixelColor(i, strip.Color(
        ((color >> 11) & 0x1F) * brightness / 31,
        ((color >> 5) & 0x3F) * brightness / 63,
        (color & 0x1F) * brightness / 31
      ));
    }
    strip.show();
    delay(10);
  }
}

void receiveAnimation(uint16_t color) {
  // Flash in sender's color
  for (int i = 0; i < 3; i++) {
    for (int j = 0; j < LED_COUNT; j++) {
      strip.setPixelColor(j, strip.Color(
        ((color >> 11) & 0x1F) * 8,
        ((color >> 5) & 0x3F) * 4,
        (color & 0x1F) * 8
      ));
    }
    strip.show();
    delay(100);
    strip.clear();
    strip.show();
    delay(100);
  }
}

void broadcastAnimation() {
  // Rainbow explosion
  for (int j = 0; j < 256; j += 8) {
    for (int i = 0; i < LED_COUNT; i++) {
      strip.setPixelColor(i, strip.ColorHSV(j * 256 + i * 4096));
    }
    strip.show();
    delay(5);
  }
}

void structureCompleteAnimation() {
  // Epic tetrahedral formation sequence
  for (int cycle = 0; cycle < 3; cycle++) {
    // Light up each node in sequence
    for (int node = 0; node < 4; node++) {
      for (int led = node * 5; led < (node + 1) * 5; led++) {
        strip.setPixelColor(led, strip.Color(
          ((nodes[node].color >> 11) & 0x1F) * 8,
          ((nodes[node].color >> 5) & 0x3F) * 4,
          (nodes[node].color & 0x1F) * 8
        ));
      }
      strip.show();
      delay(150);
    }
  }
}

void bootSequence() {
  tft.setTextSize(3);
  tft.setTextColor(me->color);
  tft.setCursor(40, 100);
  tft.println("CONNECTING...");
  
  // Loading bar
  for (int i = 0; i < LED_COUNT; i++) {
    strip.setPixelColor(i, strip.Color(
      ((me->color >> 11) & 0x1F) * 8,
      ((me->color >> 5) & 0x3F) * 4,
      (me->color & 0x1F) * 8
    ));
    strip.show();
    delay(50);
  }
  
  delay(500);
  strip.clear();
  strip.show();
}

void showError(const char* msg) {
  tft.fillScreen(COLOR_RED);
  tft.setTextColor(COLOR_WHITE);
  tft.setTextSize(2);
  tft.setCursor(50, 100);
  tft.println(msg);
}
