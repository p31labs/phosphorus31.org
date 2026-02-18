/*
 * PROTOTYPE-ZERO: Hello World Edition
 * Build Date: December 1st, 2024
 * 
 * What This Does:
 * - Shows your son's name on the screen with a cool animation
 * - Makes the LED strip do rainbow effects
 * - Teaches him that HE programmed this
 * 
 * Hardware:
 * - Adafruit ESP32-S3 Feather (SKU 4883)
 * - 2.8" TFT Touch Screen (SKU 1770)
 * - NeoPixel LED Strip (SKU 1376) - cut to ~20 LEDs
 * 
 * IMPORTANT: After uploading, press the RESET button on the Feather!
 */

#include <Adafruit_GFX.h>
#include <Adafruit_ILI9341.h>
#include <Adafruit_NeoPixel.h>

// ===== CUSTOMIZE THIS SECTION =====
const char* BUILDER_NAME = "CONNOR";  // ← CHANGE THIS TO YOUR SON'S NAME
const char* MESSAGE = "I BUILT THIS!";
// ==================================

// Pin assignments for Feather ESP32-S3 + TFT FeatherWing
#define TFT_CS   7
#define TFT_DC   39
#define TFT_RST  40

#define LED_PIN  5   // NeoPixel data pin
#define LED_COUNT 20 // Number of LEDs on your strip

// Create objects
Adafruit_ILI9341 tft = Adafruit_ILI9341(TFT_CS, TFT_DC, TFT_RST);
Adafruit_NeoPixel strip(LED_COUNT, LED_PIN, NEO_GRB + NEO_KHZ800);

// Colors (these are like paint in a computer)
#define COLOR_BLACK   0x0000
#define COLOR_BLUE    0x001F
#define COLOR_CYAN    0x07FF
#define COLOR_GREEN   0x07E0
#define COLOR_MAGENTA 0xF81F
#define COLOR_RED     0xF800
#define COLOR_YELLOW  0xFFE0
#define COLOR_WHITE   0xFFFF
#define COLOR_ORANGE  0xFD20
#define COLOR_PINK    0xFC18

void setup() {
  // Start serial monitor (so Dad can see debug messages)
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("========================================");
  Serial.println("  PROTOTYPE-ZERO: HELLO WORLD");
  Serial.println("========================================");
  Serial.print("  Builder: ");
  Serial.println(BUILDER_NAME);
  Serial.println("========================================");
  
  // Initialize the screen
  Serial.println("Starting screen...");
  tft.begin();
  tft.setRotation(1);  // Landscape mode
  tft.fillScreen(COLOR_BLACK);
  
  // Initialize LED strip
  Serial.println("Starting LEDs...");
  strip.begin();
  strip.setBrightness(50);  // Not too bright (max is 255)
  strip.show(); // Initialize all pixels to 'off'
  
  Serial.println("Setup complete! Running animations...");
  
  // Cool startup animation
  bootSequence();
}

void loop() {
  // Cycle through different effects
  
  // Effect 1: Show name with rainbow
  showNameWithRainbow();
  delay(3000);
  
  // Effect 2: Matrix-style falling code
  matrixEffect();
  delay(3000);
  
  // Effect 3: Pulsing message
  pulseMessage();
  delay(3000);
  
  // Effect 4: Bouncing ball with LED trail
  bouncingBall();
  delay(3000);
}

// ===== ANIMATIONS =====

void bootSequence() {
  // LED strip: loading bar effect
  for(int i = 0; i < LED_COUNT; i++) {
    strip.setPixelColor(i, strip.Color(0, 255, 255)); // Cyan
    strip.show();
    delay(50);
  }
  
  // Screen: Show loading text
  tft.fillScreen(COLOR_BLACK);
  tft.setTextSize(3);
  tft.setTextColor(COLOR_CYAN);
  tft.setCursor(50, 100);
  tft.println("LOADING...");
  
  delay(500);
  
  // Clear LEDs one by one
  for(int i = 0; i < LED_COUNT; i++) {
    strip.setPixelColor(i, strip.Color(0, 0, 0));
    strip.show();
    delay(30);
  }
  
  // Big reveal
  tft.fillScreen(COLOR_BLACK);
  delay(200);
  
  tft.setTextSize(4);
  tft.setTextColor(COLOR_GREEN);
  tft.setCursor(20, 80);
  tft.println("HELLO");
  
  delay(500);
  
  tft.setTextSize(5);
  tft.setTextColor(COLOR_YELLOW);
  tft.setCursor(20, 140);
  tft.println(BUILDER_NAME);
  
  // Celebrate with rainbow
  rainbowCycle(5);
  
  delay(2000);
}

void showNameWithRainbow() {
  tft.fillScreen(COLOR_BLACK);
  
  // Draw name
  tft.setTextSize(4);
  tft.setTextColor(COLOR_WHITE);
  tft.setCursor(40, 80);
  tft.println(BUILDER_NAME);
  
  // Draw message below
  tft.setTextSize(2);
  tft.setTextColor(COLOR_CYAN);
  tft.setCursor(40, 140);
  tft.println(MESSAGE);
  
  // LEDs do smooth rainbow
  for(int j = 0; j < 256; j++) {
    for(int i = 0; i < LED_COUNT; i++) {
      int pixelHue = (i * 65536L / LED_COUNT) + j * 256;
      strip.setPixelColor(i, strip.gamma32(strip.ColorHSV(pixelHue)));
    }
    strip.show();
    delay(10);
  }
}

void matrixEffect() {
  tft.fillScreen(COLOR_BLACK);
  tft.setTextSize(2);
  tft.setTextColor(COLOR_GREEN);
  
  // Random "code" characters falling
  for(int frame = 0; frame < 50; frame++) {
    // Draw 5 random characters
    for(int i = 0; i < 5; i++) {
      int x = random(0, 300);
      int y = random(0, 220);
      char c = random(33, 126); // Random ASCII character
      tft.setCursor(x, y);
      tft.print(c);
    }
    
    // LEDs: green wave
    int pos = (frame * LED_COUNT) / 50;
    strip.clear();
    strip.setPixelColor(pos % LED_COUNT, strip.Color(0, 255, 0));
    strip.setPixelColor((pos + 1) % LED_COUNT, strip.Color(0, 100, 0));
    strip.show();
    
    delay(50);
  }
}

void pulseMessage() {
  tft.fillScreen(COLOR_BLACK);
  
  // Center text
  tft.setTextSize(3);
  tft.setCursor(30, 100);
  
  // Pulse between two colors
  for(int cycle = 0; cycle < 3; cycle++) {
    // Fade in
    for(int brightness = 0; brightness < 255; brightness += 5) {
      tft.fillScreen(COLOR_BLACK);
      
      // Create color based on brightness
      uint16_t color = tft.color565(brightness, 0, brightness); // Purple
      tft.setTextColor(color);
      tft.setCursor(30, 100);
      tft.println("YOU DID IT!");
      
      // LEDs pulse too
      for(int i = 0; i < LED_COUNT; i++) {
        strip.setPixelColor(i, strip.Color(brightness, 0, brightness));
      }
      strip.show();
      
      delay(10);
    }
    
    delay(200);
    
    // Fade out
    for(int brightness = 255; brightness > 0; brightness -= 5) {
      tft.fillScreen(COLOR_BLACK);
      
      uint16_t color = tft.color565(brightness, 0, brightness);
      tft.setTextColor(color);
      tft.setCursor(30, 100);
      tft.println("YOU DID IT!");
      
      for(int i = 0; i < LED_COUNT; i++) {
        strip.setPixelColor(i, strip.Color(brightness, 0, brightness));
      }
      strip.show();
      
      delay(10);
    }
    
    delay(200);
  }
}

void bouncingBall() {
  tft.fillScreen(COLOR_BLACK);
  
  int ballX = 160;  // Screen center X
  int ballY = 120;  // Screen center Y
  int ballSpeedX = 4;
  int ballSpeedY = 3;
  int ballSize = 15;
  
  // Draw for 200 frames
  for(int frame = 0; frame < 200; frame++) {
    // Clear old ball
    tft.fillCircle(ballX, ballY, ballSize, COLOR_BLACK);
    
    // Move ball
    ballX += ballSpeedX;
    ballY += ballSpeedY;
    
    // Bounce off edges
    if(ballX <= ballSize || ballX >= 320 - ballSize) {
      ballSpeedX = -ballSpeedX;
    }
    if(ballY <= ballSize || ballY >= 240 - ballSize) {
      ballSpeedY = -ballSpeedY;
    }
    
    // Draw new ball
    tft.fillCircle(ballX, ballY, ballSize, COLOR_YELLOW);
    
    // LED trail follows ball position
    int ledPos = map(ballX, 0, 320, 0, LED_COUNT - 1);
    strip.clear();
    strip.setPixelColor(ledPos, strip.Color(255, 255, 0));
    if(ledPos > 0) strip.setPixelColor(ledPos - 1, strip.Color(100, 100, 0));
    if(ledPos < LED_COUNT - 1) strip.setPixelColor(ledPos + 1, strip.Color(100, 100, 0));
    strip.show();
    
    delay(20);
  }
}

// ===== HELPER FUNCTIONS =====

// Rainbow cycle along whole strip
void rainbowCycle(uint8_t wait) {
  for(long firstPixelHue = 0; firstPixelHue < 65536; firstPixelHue += 256) {
    for(int i = 0; i < LED_COUNT; i++) {
      int pixelHue = firstPixelHue + (i * 65536L / LED_COUNT);
      strip.setPixelColor(i, strip.gamma32(strip.ColorHSV(pixelHue)));
    }
    strip.show();
    delay(wait);
  }
}
