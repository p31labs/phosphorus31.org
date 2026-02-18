# Node-1 PCB - Package Contents

## ✅ Complete PCB Design Package

This package contains everything you need to manufacture and assemble your own Node-1 - a beautiful, tactile communication device with "The Board is the Product" design philosophy.

## 📦 What's Included

### Manufacturing Files (Ready to Upload)
- **8 Gerber Files** (.gbr format)
  - Top Copper (F_Cu) - Signal traces and pads
  - Bottom Copper (B_Cu) - Ground plane with tactile zones
  - Top Solder Mask (F_Mask) - Matte black
  - Bottom Solder Mask (B_Mask) - Matte black with exposed gold zones
  - Top Silkscreen (F_SilkS) - White geometric cyberpunk art
  - Bottom Silkscreen (B_SilkS) - White branding
  - Board Outline (Edge_Cuts) - 51x51mm square
- **1 Drill File** (.drl format)
  - All through-holes and vias

### Documentation
- **README.md** - Project overview and features
- **QUICK_START.md** - Fast-track guide to getting boards made
- **PCB_DESIGN_SPEC.md** - Complete technical specifications
- **VISUAL_REFERENCE.md** - ASCII art layouts and component placement
- **MANUFACTURING_SPEC.md** - Detailed PCB fab requirements
- **ASSEMBLY_INSTRUCTIONS.md** - Step-by-step build guide
- **BOM.csv** - Complete Bill of Materials with part numbers

### Project Files
- **node1.kicad_pro** - KiCad project file (compatible with KiCad 7+)

## 🎯 Quick Start

1. **Upload Gerbers** to JLCPCB or PCBWay
2. **Configure**: Matte Black + ENIG finish
3. **Order components** using BOM.csv
4. **Assemble** following instructions
5. **Program** ESP32-S3 and enjoy!

## 💰 Cost Estimate

- PCBs (5x): $40-60 USD
- Components: $30-50 USD
- Accessories: $10-15 USD
- **Total**: ~$80-125 USD (enough for 5 boards!)

## 🔧 Key Features

- **ESP32-S3**: WiFi + Bluetooth + dual-core processing
- **LoRa Radio**: 900MHz long-range communication
- **Haptic Feedback**: DRV2605L haptic driver
- **RGB LEDs**: 5x Neopixel underglow
- **Mechanical Inputs**: 2x Kailh Choc switches + rotary encoder
- **Tactile Touch Zones**: Exposed ENIG gold for sensory feedback
- **Battery Powered**: LiPo charging via USB-C

## 📐 Specifications

- **Size**: 51mm x 51mm (2" x 2")
- **Layers**: 2-layer FR4
- **Finish**: ENIG (gold) on Matte Black
- **Thickness**: 1.6mm
- **Mounting**: 4x M2.5 holes

## ⚠️ Important Notes

### Manufacturing
- **ENIG finish is critical** - provides gold touch zones
- **Matte Black (not glossy)** - for proper aesthetic
- **Touch zones are intentional** - exposed copper on bottom layer

### Legal
- **LoRa transmission may require licensing** in your region
- Check 900MHz band regulations before transmitting
- USA: 902-928 MHz ISM band (usually OK)
- EU: Different frequencies apply

### Safety
- **LiPo batteries require care** - don't reverse polarity
- **ESD sensitive** - use anti-static precautions
- **Check all connections** before powering on

## 🎨 Design Philosophy

This board celebrates electronics as art:
- **Visible Technology**: Exposed traces and components
- **Premium Aesthetic**: Matte black + gold cyberdeck look
- **Tactile Engagement**: Multiple sensory feedback methods
- **Neurodivergent-Friendly**: Rich, satisfying interactions

## 📚 File Organization

```
node1_pcb/
├── gerbers/                    ← Upload these to PCB fab
│   ├── node1-F_Cu.gbr
│   ├── node1-B_Cu.gbr
│   ├── node1-F_Mask.gbr
│   ├── node1-B_Mask.gbr
│   ├── node1-F_SilkS.gbr
│   ├── node1-B_SilkS.gbr
│   ├── node1-Edge_Cuts.gbr
│   └── node1.drl
├── fabrication/
│   ├── BOM.csv                ← Component list
│   ├── MANUFACTURING_SPEC.md  ← PCB fab settings
│   └── ASSEMBLY_INSTRUCTIONS.md ← Build guide
├── README.md                  ← Start here
├── QUICK_START.md             ← Fast track guide
├── PCB_DESIGN_SPEC.md         ← Technical details
├── VISUAL_REFERENCE.md        ← Component placement
└── node1.kicad_pro ← KiCad project
```

## 🚀 Next Steps

1. **Read QUICK_START.md** for fastest path to building
2. **Review VISUAL_REFERENCE.md** to see component layout
3. **Upload gerbers/** folder to JLCPCB
4. **Order parts** using fabrication/BOM.csv
5. **Follow ASSEMBLY_INSTRUCTIONS.md** when parts arrive

## 💡 Pro Tips

- Order **extra 0805 components** (they're tiny and easy to lose)
- Use **solder paste + hot plate** for SMD assembly
- **Test subsystems** as you build (don't wait until end)
- Join **maker communities** for support (Reddit r/cyberDeck)
- **Document your build** with photos!

## 📞 Support

This is an open-source hardware project. If you have questions:
- Check the documentation thoroughly
- Search GitHub issues (when published)
- Join maker community forums
- Share your build and ask for help

## 📜 License

- Hardware: CERN-OHL-S-v2 (open source hardware)
- Documentation: CC BY-SA 4.0
- You're free to make, sell, and modify!

## 🌟 Share Your Build

When you complete your board:
- Take beautiful photos of the matte black + gold finish
- Show off the tactile touch zones
- Share on r/cyberDeck, Twitter, Instagram
- Tag with #SensoryCyberdeck
- Inspire others to build!

---

## What Makes This Special?

Most PCBs are designed to be hidden in enclosures. This board is different:

- **The PCB IS the product** - beautiful enough to display openly
- **Tactile by design** - gold touch zones for sensory engagement  
- **Maker-friendly** - clear documentation, open source, moddable
- **Neurodivergent-optimized** - multiple input methods, satisfying feedback
- **Community-focused** - share, remix, improve together

This isn't just a circuit board. It's a statement that electronics can be beautiful, engaging, and human-centered.

**Now go make something amazing!** ✨

---

*Created with ❤️ for the maker community*
*Version 1.0 - December 2024*
