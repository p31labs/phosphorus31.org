/*Using LVGL with Arduino requires some extra steps:
 *Be sure to read the docs here: https://docs.lvgl.io/master/get-started/platforms/arduino.html  */

#include <lvgl.h>

/*To use the built-in examples and demos of LVGL uncomment the includes below respectively.
 *You also need to copy `lvgl/examples` to `lvgl/src/examples`. Similarly for the demos `lvgl/demos` to `lvgl/src/demos`.
 Note that the `lv_examples` library is for LVGL v7 and you shouldn't install it for this version (since LVGL v8)
 as the examples and demos are now part of the main LVGL library. */

// #include <examples/lv_examples.h>
// #include <demos/lv_demos.h>

// #define DIRECT_MODE // Uncomment to enable full frame buffer

#include <Arduino_GFX_Library.h>
#include "TCA9554.h"
#include "TouchDrvFT6X36.hpp"
#include <XPowersLib.h> // Added for Phenix Phantom PMIC Support

// #define GFX_BL 6  // Replaced by TCA9554 control

#define SPI_MISO 2
#define SPI_MOSI 1
#define SPI_SCLK 5

#define LCD_CS -1
#define LCD_DC 3
#define LCD_RST -1
#define LCD_HOR_RES 320
#define LCD_VER_RES 480

// Updated for Phenix Phantom (ESP32-S3-Touch-LCD-3.5B)
#define I2C_SDA 8
#define I2C_SCL 9

#define PMIC_ADDR 0x34

TCA9554 TCA(0x20);
XPowersAXP2101 PMIC;

Arduino_DataBus *bus = new Arduino_ESP32SPI(LCD_DC /* DC */, LCD_CS /* CS */, SPI_SCLK /* SCK */, SPI_MOSI /* MOSI */, SPI_MISO /* MISO */);
Arduino_GFX *gfx = new Arduino_ST7796(
  bus, LCD_RST /* RST */, 0 /* rotation */, true, LCD_HOR_RES, LCD_VER_RES);

TouchDrvFT6X36 touch;

uint32_t screenWidth;
uint32_t screenHeight;
uint32_t bufSize;
lv_disp_draw_buf_t draw_buf;
lv_color_t *disp_draw_buf1;
lv_color_t *disp_draw_buf2;
lv_disp_drv_t disp_drv;


/* Display flushing */
void my_disp_flush(lv_disp_drv_t *disp_drv, const lv_area_t *area, lv_color_t *color_p) {
#ifndef DIRECT_MODE
  uint32_t w = (area->x2 - area->x1 + 1);
  uint32_t h = (area->y2 - area->y1 + 1);

#if (LV_COLOR_16_SWAP != 0)
  gfx->draw16bitBeRGBBitmap(area->x1, area->y1, (uint16_t *)&color_p->full, w, h);
#else
  gfx->draw16bitRGBBitmap(area->x1, area->y1, (uint16_t *)&color_p->full, w, h);
#endif
#endif  // #ifndef DIRECT_MODE

  lv_disp_flush_ready(disp_drv);
}

/*Read the touchpad*/
void my_touchpad_read(lv_indev_drv_t *indev_drv, lv_indev_data_t *data) {
  int16_t x[1], y[1];
  uint8_t touched = touch.getPoint(x, y, 1);

  if (touched) {
    data->state = LV_INDEV_STATE_PR;

    /*Set the coordinates*/
    data->point.x = x[0];
    data->point.y = y[0];
  } else {
    data->state = LV_INDEV_STATE_REL;
  }
}

void lcd_reset(void) {
  // P2 is LCD_RST on 3.5B
  TCA.write1(2, 0); // Active Low
  delay(100);
  TCA.write1(2, 1); // Release
  delay(100);
}

void enable_backlight(void) {
  // P1 is BL_EN on 3.5B
  TCA.write1(1, 1);
}

void setup() {

  Serial.begin(115200);
  
  // Initialize I2C Bus with correct pins for 3.5B
  Wire.begin(I2C_SDA, I2C_SCL);

  // Initialize PMIC (AXP2101) - The "Power Sequencing Ritual"
  if (!PMIC.begin(Wire, PMIC_ADDR, I2C_SDA, I2C_SCL)) {
       Serial.println("Error: PMIC Initialization Failed! The Abyss stares back.");
  } else {
       Serial.println("PMIC Initialized.");
       // Enable Critical Rails
       PMIC.setALDO1Voltage(3300); PMIC.enableALDO1(); // Logic Power
       PMIC.setALDO2Voltage(3300); PMIC.enableALDO2(); // Touch Controller
       PMIC.setALDO3Voltage(3300); PMIC.enableALDO3(); // LCD Logic & Backlight Driver
       PMIC.setBLDO1Voltage(3300); PMIC.enableBLDO1(); // High Voltage Rail
       delay(100); 
  }

  // Initialize TCA9554
  TCA.begin();
  TCA.pinMode1(1, OUTPUT); // BL_EN
  TCA.pinMode1(2, OUTPUT); // LCD_RST
  
  lcd_reset();
  enable_backlight();

  Serial.println("Arduino_GFX Hello World example");

  if (!touch.begin(Wire, FT6X36_SLAVE_ADDRESS)) {
    Serial.println("Failed to find FT6X36 - check your wiring!");
    // while (1) delay(1000);
  }
  // Init Display
  if (!gfx->begin()) {
    Serial.println("gfx->begin() failed!");
  }

  gfx->fillScreen(RGB565_BLACK);

  lv_init();

  screenWidth = gfx->width();
  screenHeight = gfx->height();

  // Full screen buffer in SPIRAM for Phenix Phantom compliance
  bufSize = screenWidth * screenHeight;

  disp_draw_buf1 = (lv_color_t *)heap_caps_malloc(bufSize * sizeof(lv_color_t), MALLOC_CAP_SPIRAM);

  disp_draw_buf2 = (lv_color_t *)heap_caps_malloc(bufSize * sizeof(lv_color_t), MALLOC_CAP_SPIRAM);

  lv_disp_draw_buf_init(&draw_buf, disp_draw_buf1, disp_draw_buf2, bufSize);

  /* Initialize the display */
  lv_disp_drv_init(&disp_drv);
  /* Change the following line to your display resolution */
  disp_drv.hor_res = screenWidth;
  disp_drv.ver_res = screenHeight;
  disp_drv.flush_cb = my_disp_flush;
  disp_drv.draw_buf = &draw_buf;

  lv_disp_drv_register(&disp_drv);


  static lv_indev_drv_t indev_drv;
  lv_indev_drv_init(&indev_drv);
  indev_drv.type = LV_INDEV_TYPE_POINTER;
  indev_drv.read_cb = my_touchpad_read;
  lv_indev_drv_register(&indev_drv);

  /* Initialize the (dummy) input device driver */
  lv_obj_t *label = lv_label_create(lv_scr_act());
  lv_label_set_text(label, "Phenix Phantom Compliant (V" GFX_STR(LVGL_VERSION_MAJOR) "." GFX_STR(LVGL_VERSION_MINOR) "." GFX_STR(LVGL_VERSION_PATCH) ")");
  lv_obj_align(label, LV_ALIGN_CENTER, 0, 0);

  lv_obj_t *sw = lv_switch_create(lv_scr_act());
  lv_obj_align(sw, LV_ALIGN_TOP_MID, 0, 50);

  sw = lv_switch_create(lv_scr_act());
  lv_obj_align(sw, LV_ALIGN_BOTTOM_MID, 0, -50);

  /* Option 3: Or try out a demo. Don't forget to enable the demos in lv_conf.h. E.g. LV_USE_DEMOS_WIDGETS*/
  // lv_demo_widgets();
  // lv_demo_benchmark();
  // lv_demo_keypad_encoder();
  // lv_demo_music();
  // lv_demo_stress();

  Serial.println("Setup done");
}

void loop() {
  lv_timer_handler(); /* let the GUI do its work */
  delay(1);
}
