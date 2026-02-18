# Node-1 PCB - Complete Package Summary

## ✅ Package Complete - Ready for Manufacturing!

This package contains **everything** you need to manufacture, assemble, and use your Node-1 communication device.

---

## 📦 What's Inside (24 Files)

### Manufacturing Files (Ready to Upload)
```
gerbers/
├── node1-F_Cu.gbr .............. Top copper layer
├── node1-B_Cu.gbr .............. Bottom copper (ground plane)
├── node1-F_Mask.gbr ............ Top solder mask (matte black)
├── node1-B_Mask.gbr ............ Bottom solder mask (with touch zones)
├── node1-F_SilkS.gbr ........... Top silkscreen (geometric art)
├── node1-B_SilkS.gbr ........... Bottom silkscreen (branding)
├── node1-Edge_Cuts.gbr ......... Board outline (51×51mm)
└── node1.drl ................... Drill file (holes & vias)
```

### Documentation (Read First!)
```
START_HERE.txt .................. Welcome guide & navigation
QUICK_START.md .................. Fast-track to ordering (10 min)
README.md ....................... Full project overview
PACKAGE_CONTENTS.md ............. What's included guide
```

### Design References
```
PCB_DESIGN_SPEC.md .............. Complete technical specs
VISUAL_REFERENCE.md ............. ASCII component layouts
3D_RENDERS.md ................... 9 detailed visualization renders
```

### Assembly & Manufacturing
```
fabrication/
├── BOM.csv ..................... Component shopping list
├── node1_CPL.csv ............... Component placement (for JLCPCB)
├── MANUFACTURING_SPEC.md ....... PCB fabrication settings
└── ASSEMBLY_INSTRUCTIONS.md .... Step-by-step build guide

JLCPCB_ASSEMBLY_GUIDE.md ........ How to order with assembly service
```

### Project Files
```
node1.kicad_pro ................. KiCad project (v7+)
```

---

## 🚀 Three Ways to Build Node-1

### Option 1: Full DIY (Cheapest)
**Cost**: ~$80-100 for 5 boards
1. Order bare PCBs from JLCPCB ($30-40)
2. Buy all components ($30-50)
3. Hand-solder everything yourself
**Time**: 6-8 hours assembly per board
**Best for**: Experienced builders, learning experience

### Option 2: Partial Assembly (Recommended) ⭐
**Cost**: ~$120-150 for 5 boards
1. Order from JLCPCB with SMD assembly ($80-120)
2. They solder all tiny parts (resistors, caps, ICs, LEDs)
3. You hand-solder easy parts (switches, headers, modules)
**Time**: 2-3 hours assembly per board
**Best for**: Most people, good balance

### Option 3: Full Assembly Service
**Cost**: ~$200-300 for 5 boards
1. Use premium assembly service (PCBWay, MacroFab)
2. They assemble everything possible
3. You only plug in switches and add battery
**Time**: 30 min final assembly per board
**Best for**: If time > money, professional quality needed

---

## 🎯 Quick Start (3 Steps)

### 1. Read Documentation (30 minutes)
```
START_HERE.txt → QUICK_START.md → 3D_RENDERS.md
```

### 2. Order PCBs (10 minutes)
- Go to https://jlcpcb.com
- Upload `gerbers/` folder
- Select: **Matte Black + ENIG** finish
- Optional: Add SMT assembly (read JLCPCB_ASSEMBLY_GUIDE.md)
- Pay ~$40-150 depending on options

### 3. Order Components (20 minutes)
- Review `fabrication/BOM.csv`
- Order from Mouser, LCSC, or AliExpress
- Don't forget battery, display, keycaps!

**Wait**: 2-3 weeks for everything to arrive
**Build**: Follow ASSEMBLY_INSTRUCTIONS.md

---

## 📋 Node-1 Specifications

### Board
- **Size**: 51mm × 51mm (2" × 2")
- **Layers**: 2-layer FR4
- **Finish**: ENIG (Electroless Nickel Immersion Gold)
- **Color**: Matte Black solder mask
- **Silkscreen**: White geometric patterns

### Core Components
- **MCU**: ESP32-S3-WROOM-1 (240MHz dual-core, WiFi + BLE)
- **Radio**: E22-900M30S LoRa 900MHz (1W output, up to 10km range)
- **Haptics**: DRV2605L haptic driver with vibration motor
- **LEDs**: 5× SK6812 RGB side-emitting (Neopixel compatible)
- **Display**: I2C header for 1.3" OLED (SH1106/SSD1306)
- **Power**: USB-C charging + 3.7V LiPo battery

### Inputs
- 2× Kailh Choc mechanical switches (hot-swappable)
- 1× EC11 rotary encoder with push button
- 2× Touch zones (exposed ENIG gold on bottom)

### Features
- WiFi 802.11 b/g/n
- Bluetooth LE 5.0
- LoRa long-range communication
- RGB underglow effects
- Haptic feedback
- Battery voltage monitoring
- Feather-compatible pinout for expansion

---

## 💰 Cost Breakdown

### Bare PCBs Only
| Item | Quantity | Cost |
|------|----------|------|
| PCBs from JLCPCB | 5 boards | $35 |
| Shipping | - | $15 |
| **Subtotal** | | **$50** |

### Components (All DIY)
| Category | Cost |
|----------|------|
| ESP32-S3 modules (5×) | $15 |
| LoRa modules (5×) | $35 |
| Other ICs | $15 |
| Passives (R, C) | $10 |
| LEDs | $5 |
| Connectors | $5 |
| Switches & Encoder | $15 |
| Misc (battery, display) | $20 |
| **Subtotal** | **$120** |

### With JLCPCB Assembly
| Item | Cost |
|------|------|
| PCBs + Assembly | $80-120 |
| Components (they source) | $30-50 |
| Parts you solder | $20-30 |
| **Subtotal** | **$130-200** |

**You get 5 boards**, so cost per board:
- DIY: $34 per board
- Assembly: $40-50 per board

---

## 🎨 What Makes Node-1 Special

### "The Board is the Product"
Unlike typical PCBs hidden in cases, Node-1 is designed to be displayed:

✨ **Visual Appeal**
- Matte black + gold finish (premium "cyberdeck" aesthetic)
- Geometric silkscreen patterns
- Visible component layout shows technology as art

🤲 **Tactile Engagement**
- Mechanical keyboard switches (satisfying clicks)
- Rotary encoder (tactile detents)
- Exposed gold touch zones (smooth, cold metal)
- Haptic vibration feedback

👁️ **Clear Feedback**
- 5 RGB LEDs with customizable underglow
- Visual status indicators
- Physical vibration confirms actions

🧩 **Modular Design**
- Feather-compatible pinout
- Add GPS, sensors, larger displays
- Exposed I2C, SPI, GPIO headers

🧠 **Neurodivergent-Friendly**
- Multiple input methods
- Satisfying sensory feedback
- System thinking visible in layout
- Fidget-friendly interactions

---

## 📸 Visualizations

See `3D_RENDERS.md` for:
- Isometric views (top & bottom)
- Exploded assembly diagram
- Component closeups
- LED effects preview
- In-hand size comparison
- Material finish details
- Real-world use cases

---

## ⚠️ Critical Manufacturing Notes

### Must-Have PCB Settings
❗ **ENIG Surface Finish** - Required for gold touch zones
❗ **Matte Black Solder Mask** - NOT glossy black
❗ **Exposed Copper Zones** - Bottom touch areas are intentional

### Legal Considerations
❗ Check LoRa frequency regulations in your country
- USA: 902-928 MHz (usually license-free)
- EU: 863-870 MHz (varies by country)
- Other regions: Verify before transmitting!

### Safety
❗ LiPo battery requires careful handling
- Never reverse polarity
- Use proper charging practices
- Don't puncture or short circuit

---

## 📞 Support & Community

### Documentation
Start with these files in order:
1. START_HERE.txt (5 min)
2. QUICK_START.md (10 min)
3. 3D_RENDERS.md (15 min)
4. BOM.csv (component shopping)
5. Assembly guide when parts arrive

### Getting Help
- Read all documentation thoroughly
- Check JLCPCB's assembly FAQ
- Search maker forums (r/PrintedCircuitBoard)
- Review KiCad documentation for design questions

### Sharing Your Build
When you complete Node-1:
- Take photos of the matte black + gold finish
- Share on r/cyberDeck, maker forums
- Document any modifications
- Help others in the community!

---

## ✅ Pre-Order Checklist

Before ordering, verify you have:

**Files Ready**
- [ ] Downloaded complete package
- [ ] Extracted all files
- [ ] Read START_HERE.txt
- [ ] Reviewed QUICK_START.md

**Account Setup**
- [ ] JLCPCB account created (or PCBWay)
- [ ] Payment method ready
- [ ] Shipping address confirmed

**Decision Made**
- [ ] Bare PCBs only OR with assembly?
- [ ] Read JLCPCB_ASSEMBLY_GUIDE.md if using assembly
- [ ] Budget confirmed (~$80-200)

**Component Sourcing**
- [ ] Reviewed BOM.csv
- [ ] Decided where to buy parts
- [ ] Checked part availability

**Legal Check**
- [ ] Verified LoRa frequency is legal in your region
- [ ] Read local transmission regulations

---

## 🌟 You're Ready to Build!

This package contains everything you need. No guessing, no missing files, no surprises.

**Next steps:**
1. Read QUICK_START.md
2. Upload gerbers to JLCPCB
3. Order components
4. Wait 2-3 weeks
5. Assemble following instructions
6. Enjoy your Node-1!

---

## 📜 License

**Hardware Design**: CERN Open Hardware Licence v2 - Strongly Reciprocal
**Documentation**: Creative Commons BY-SA 4.0
**Example Code**: MIT License

You are free to:
- ✓ Make for personal use
- ✓ Modify the design
- ✓ Sell assembled units
- ✓ Create derivatives

You must:
- ✓ Give credit to original designer
- ✓ Share modifications under same license
- ✓ Include license notice

---

**Node-1 v1.0 | December 2024 | Open Source Hardware**

*"The Board is the Product"*

Good luck with your build! 🚀✨
