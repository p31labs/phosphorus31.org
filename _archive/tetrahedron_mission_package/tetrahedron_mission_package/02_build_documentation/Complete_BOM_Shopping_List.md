# COMPLETE BILL OF MATERIALS
## 8-Node Tetrahedron Protocol Build

**Total Cost Estimate:** ~$1,000  
**Source:** Adafruit (primary vendor for consistency)  
**Timeline:** Order by Nov 30 for Dec 1-3 delivery

---

## 🛒 CORE COMPONENTS (Per Node × 8)

### **1. ESP32-S3 Feather**
- **Part:** Adafruit ESP32-S3 Feather with 4MB Flash 2MB PSRAM
- **SKU:** 4883
- **Price:** $17.50 each
- **Quantity:** 8
- **Subtotal:** $140.00
- **Link:** https://www.adafruit.com/product/4883
- **Purpose:** Main microcontroller, "the brain"

### **2. LoRa Radio FeatherWing**
- **Part:** Adafruit LoRa Radio FeatherWing - RFM95W 900 MHz
- **SKU:** 3231
- **Price:** $19.95 each
- **Quantity:** 8
- **Subtotal:** $159.60
- **Link:** https://www.adafruit.com/product/3231
- **Purpose:** 915MHz radio module, "the voice"
- **Note:** Includes antenna

### **3. TFT Touchscreen**
- **Part:** Adafruit 2.8" TFT Touch Shield for Arduino
- **SKU:** 1651
- **Price:** $34.95 each
- **Quantity:** 8
- **Subtotal:** $279.60
- **Link:** https://www.adafruit.com/product/1651
- **Purpose:** Display and touch input
- **Alternative:** 2.4" version (SKU 1770) at $34.95 if 2.8" unavailable

### **4. LiPo Battery**
- **Part:** Lithium Ion Polymer Battery - 2500mAh
- **SKU:** 328
- **Price:** $14.95 each
- **Quantity:** 8
- **Subtotal:** $119.60
- **Link:** https://www.adafruit.com/product/328
- **Purpose:** Power source, 6-8 hour runtime

### **5. NeoPixel LED Strip**
- **Part:** Adafruit NeoPixel Digital RGB LED Strip - 60 LED/m
- **SKU:** 1376 (1 meter)
- **Price:** $24.95 per meter
- **Quantity:** 2 meters (cut to 20 LEDs per node)
- **Subtotal:** $49.90
- **Link:** https://www.adafruit.com/product/1376
- **Purpose:** Status indicators, "the lights"

### **6. Arcade Buttons** (4 per node)
- **Part:** 16mm Illuminated Pushbutton - Various Colors
- **SKU:** 1439 (red), 1440 (green), 1441 (blue), 1442 (yellow)
- **Price:** $2.50 each
- **Quantity:** 32 total (8 nodes × 4 buttons)
- **Subtotal:** $80.00
- **Link:** https://www.adafruit.com/product/1439
- **Purpose:** Direct messaging to each node
- **Color scheme:** Blue (Node 1), Green (Node 2), Yellow (Node 3), Purple (Node 4)

---

## 🔧 ASSEMBLY COMPONENTS

### **7. Stacking Headers**
- **Part:** Feather Stacking Headers - 12-pin and 16-pin female headers
- **SKU:** 2830
- **Price:** $1.25 per set
- **Quantity:** 8 sets
- **Subtotal:** $10.00
- **Link:** https://www.adafruit.com/product/2830
- **Purpose:** Stack Feather + LoRa wing

### **8. Header Pins** (for TFT shields)
- **Part:** Break-away 0.1" 36-pin strip male header
- **SKU:** 392
- **Price:** $0.95 per strip
- **Quantity:** 4 strips (enough for all 8 nodes)
- **Subtotal:** $3.80
- **Link:** https://www.adafruit.com/product/392
- **Purpose:** Connect TFT to Feather stack

### **9. Hookup Wire**
- **Part:** Hook-up Wire Spool Set - 22AWG Solid Core - 6 x 25ft
- **SKU:** 3111
- **Price:** $17.95 per set
- **Quantity:** 1 set (sufficient for all nodes)
- **Subtotal:** $17.95
- **Link:** https://www.adafruit.com/product/3111
- **Purpose:** Button connections, LED wiring

### **10. JST Connectors** (for battery)
- **Part:** JST-PH 2-Pin Cable - Female Connector (pack of 10)
- **SKU:** 4714
- **Price:** $3.95
- **Quantity:** 1 pack
- **Subtotal:** $3.95
- **Link:** https://www.adafruit.com/product/4714
- **Purpose:** Battery connections (backup if needed)

---

## 🔩 ENCLOSURE & MOUNTING

### **11. Project Enclosures**
- **Option A:** 3D Print custom tetrahedron cases
  - **STL files:** To be created
  - **Cost:** $0 if you have access to 3D printer
  - **Alternative:** ~$50-100 if ordering prints

- **Option B:** Standard project boxes
  - **Part:** Clear plastic project box 4.5" × 3.3" × 1.2"
  - **Source:** Amazon or similar
  - **Cost:** ~$3-5 each × 8 = $24-40
  - **Link:** Search "clear project box electronics"

### **12. Mounting Hardware**
- **Part:** Nylon screw and standoff set
- **Source:** Amazon
- **Cost:** ~$15 for complete assortment
- **Purpose:** Mount PCBs inside enclosures
- **Note:** Use nylon (not metal) to prevent shorts

---

## 🛠️ TOOLS & SUPPLIES

### **Essential (if you don't have):**

**Soldering Iron**
- **Recommended:** PINECIL Smart Mini Portable Soldering Iron
- **Price:** ~$26
- **Link:** Amazon or AliExpress
- **Alternative:** Any 40W+ soldering station

**Solder**
- **Recommended:** Lead-free rosin core solder, 0.031" diameter
- **Price:** ~$10
- **Quantity:** One spool sufficient

**Helping Hands**
- **Purpose:** Hold components while soldering
- **Price:** ~$10-15
- **Link:** Amazon "helping hands soldering"

**Flush Cutters**
- **Purpose:** Trim wires and component leads
- **Price:** ~$8
- **Link:** Amazon "flush cut wire cutters"

**Wire Strippers**
- **Purpose:** Strip hookup wire
- **Price:** ~$10
- **Link:** Amazon "wire strippers 22 AWG"

**Safety Glasses**
- **Purpose:** Eye protection while soldering
- **Price:** ~$5
- **MANDATORY:** Do not solder without eye protection

**Multimeter** (if you don't have)
- **Purpose:** Testing connections, checking voltages
- **Price:** ~$15-20
- **Link:** Amazon "digital multimeter"

---

## 💾 SOFTWARE REQUIREMENTS

**All FREE - No cost:**

### **Arduino IDE**
- **Version:** 2.3.2 or newer
- **Link:** https://www.arduino.cc/en/software
- **Purpose:** Upload firmware to devices

### **Required Libraries** (install via Arduino Library Manager):
- Adafruit GFX Library
- Adafruit ILI9341
- Adafruit NeoPixel
- RadioHead (for LoRa)
- Adafruit BusIO

### **Board Support:**
- ESP32 board package by Espressif Systems
- **Installation:** Add to Board Manager URLs: 
  `https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json`

### **Drivers:**
- CP2104 USB to Serial driver (for ESP32-S3)
- **Link:** https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers

---

## 💰 COST BREAKDOWN

### **Core Components:**
| Item | Quantity | Unit Price | Subtotal |
|------|----------|------------|----------|
| ESP32-S3 Feather | 8 | $17.50 | $140.00 |
| LoRa FeatherWing | 8 | $19.95 | $159.60 |
| TFT Touchscreen | 8 | $34.95 | $279.60 |
| LiPo Battery | 8 | $14.95 | $119.60 |
| NeoPixel Strip | 2m | $24.95 | $49.90 |
| Arcade Buttons | 32 | $2.50 | $80.00 |
| **Subtotal** | | | **$828.70** |

### **Assembly Components:**
| Item | Cost |
|------|------|
| Stacking Headers | $10.00 |
| Header Pins | $3.80 |
| Hookup Wire | $17.95 |
| JST Connectors | $3.95 |
| **Subtotal** | **$35.70** |

### **Enclosures:**
| Option | Cost |
|--------|------|
| 3D Printed (DIY) | $0-50 |
| Project Boxes | $24-40 |
| **Estimated** | **$30** |

### **Tools** (one-time purchase if needed):
| Item | Cost |
|------|------|
| Soldering Iron | $26 |
| Solder | $10 |
| Helping Hands | $12 |
| Flush Cutters | $8 |
| Wire Strippers | $10 |
| Safety Glasses | $5 |
| Multimeter | $15 |
| **Subtotal** | **$86** |

---

## 📊 TOTAL INVESTMENT

### **If You Have Tools:**
- Core Components: $828.70
- Assembly Parts: $35.70
- Enclosures: $30.00
- **Total: ~$895**

### **If You Need Tools:**
- Above + Tools: $86.00
- **Total: ~$980**

### **Rounded Budget:**
**$1,000 covers everything including shipping**

---

## 🛒 ADAFRUIT BULK ORDER

**Create cart with these SKUs:**

```
SKU 4883 × 8 (ESP32-S3 Feather)
SKU 3231 × 8 (LoRa FeatherWing)
SKU 1651 × 8 (TFT Shield) OR SKU 1770 if 1651 unavailable
SKU 328 × 8 (Battery 2500mAh)
SKU 1376 × 2 (NeoPixel Strip 1m)
SKU 1439 × 8 (Red button)
SKU 1440 × 8 (Green button)
SKU 1441 × 8 (Blue button)
SKU 1442 × 8 (Yellow button)
SKU 2830 × 8 (Stacking headers)
SKU 392 × 4 (Header pins)
SKU 3111 × 1 (Wire spool set)
SKU 4714 × 1 (JST connectors)
```

**Direct Cart Link:** *(Adafruit doesn't support pre-populated carts, must add manually)*

**Shipping Options:**
- **USPS Priority:** 2-3 days, ~$10-15
- **UPS Ground:** 3-5 days, ~$15-20
- **Order by Nov 30 to receive by Dec 3**

---

## 📦 ALTERNATIVE SOURCING

### **If Adafruit items are backordered:**

**ESP32-S3 Alternative:**
- Any ESP32-S3 dev board with USB-C
- Must have battery charging circuit
- SparkFun, DOIT, or generic ESP32-S3 boards work

**LoRa Alternative:**
- RFM95W breakout boards
- HopeRF RFM95W modules
- Verify 915MHz for USA (868MHz for EU)

**Display Alternative:**
- Any 2.4"-3.2" TFT with ILI9341 controller
- Touch optional (can use buttons only)
- Amazon "ILI9341 touchscreen Arduino"

**Battery Alternative:**
- Any 3.7V LiPo 1000-3000mAh
- Must have JST-PH 2-pin connector
- Higher mAh = longer runtime

**LED Alternative:**
- Any WS2812B addressable LED strip
- 60 LEDs/meter density
- Cut to 20 LEDs per node

---

## 🚨 CRITICAL NOTES

### **Frequency Legality:**
- **USA/Americas:** 915 MHz (SKU 3231) ✓
- **Europe:** 868 MHz (SKU 3230)
- **Asia:** 433 MHz (SKU 3229)
- **Verify your region before ordering**

### **Battery Safety:**
- Never charge puffy batteries
- Store at ~50% charge when not in use
- Never cut both wires simultaneously
- Keep away from metal objects
- Use fireproof charging bag (optional but recommended)

### **Component Compatibility:**
- All listed parts are tested compatible
- Substituting components may require firmware changes
- Stick to recommended parts for first build

---

## 📋 PRE-ORDER CHECKLIST

Before placing order:

- [ ] Confirmed correct LoRa frequency for your region
- [ ] Checked Adafruit stock availability
- [ ] Verified shipping address
- [ ] Selected expedited shipping for Dec 1-3 arrival
- [ ] Budget approved (~$900-1000)
- [ ] Tools inventory (do you need to order tools separately?)
- [ ] Backup plan if items are backordered

---

## 📧 ORDER TRACKING

**After ordering:**

- [ ] Save order confirmation email
- [ ] Note tracking number
- [ ] Set delivery alert
- [ ] Plan for someone to receive package
- [ ] Inspect package upon arrival (check for damage)
- [ ] Inventory all components (verify quantities)

---

## ✅ PARTS RECEIVED CHECKLIST

**Verify you have:**

- [ ] 8× ESP32-S3 Feathers (check for damage)
- [ ] 8× LoRa FeatherWings (antennas included?)
- [ ] 8× TFT touchscreens (test one for cracks)
- [ ] 8× LiPo batteries (check voltage ~3.7V, inspect for swelling)
- [ ] 2× NeoPixel strips (60 LEDs/meter, full meter each)
- [ ] 32× Arcade buttons (8 each of 4 colors)
- [ ] 8× Stacking header sets
- [ ] 4× Header pin strips
- [ ] Wire spool set (6 colors)
- [ ] JST connector pack
- [ ] Tools (if ordered)

**If anything is missing or damaged:**
- Contact Adafruit immediately
- Take photos of damage
- Request replacement before starting build

---

**You're investing ~$1,000 in materials.**

**This covers 8 complete nodes:**
- 4 for your family
- 4 for your friend's family

**This is your R&D budget.**  
**This is your validation experiment.**  
**This is your proof of concept.**

**Order carefully. Document everything.**

▲
