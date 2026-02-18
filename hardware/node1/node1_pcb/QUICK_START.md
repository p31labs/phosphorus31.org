# Quick Start: Getting Your Node-1 Made

## Step 1: Order PCBs (10 minutes)

### Recommended: JLCPCB
1. Go to https://jlcpcb.com
2. Click "Order Now"
3. Upload `node1_pcb_complete.zip` (or just the gerbers folder)
4. **Configure these settings:**
   - PCB Qty: **5** (minimum order)
   - Layers: **2**
   - Dimensions: Will auto-detect (51 x 51 mm)
   - PCB Thickness: **1.6**
   - Surface Finish: **ENIG** (very important!)
   - Solder Mask: **Matte Black** (not glossy!)
   - Silkscreen: **White**
   - Remove Order Number: **Specify a location** (or Yes if option available)
5. Click "Save to Cart"
6. Checkout and pay (~$40-60 USD with shipping)

**Wait time:** 3-5 days production + 3-7 days shipping

### Alternative: PCBWay
- Similar process, slightly higher quality, about $10-20 more expensive
- Good if JLCPCB's matte black isn't dark enough for you

## Step 2: Order Components (30 minutes)

### Option A: All from AliExpress/LCSC (Cheapest, ~$30)
Use the BOM.csv file and search for each part. Main items:
- ESP32-S3-WROOM-1 module
- E22-900M30S LoRa module (or RFM95 compatible)
- DRV2605L haptic driver IC
- TP4056 charging IC
- Kailh Choc switches (2x)
- SK6812 side-LEDs (5x)
- Resistors and capacitors (0805 size)
- USB-C connector
- JST battery connector

### Option B: Mouser/Digikey (Faster, ~$50)
Upload the BOM.csv to their BOM tool for one-click ordering.
Higher cost but guaranteed genuine parts and fast shipping.

### Don't Forget:
- **3.7V LiPo Battery** (1000-2000mAh recommended)
- **Vibration Motor** (ERM or LRA for haptic feedback)
- **1.3" OLED Display** (I2C, SH1106 or SSD1306)
- **Keycaps** for Choc switches (2x, 1u size)
- **Knob** for rotary encoder

## Step 3: Assembly (2-4 hours)

Follow the detailed guide in `ASSEMBLY_INSTRUCTIONS.md`, but briefly:

1. **SMD Components** (use hot plate or reflow oven if possible)
   - Resistors and capacitors first
   - Then ICs and modules
   - LEDs last (heat sensitive!)

2. **Through-Hole Components**
   - Headers and connectors
   - Hotswap sockets
   - Rotary encoder

3. **Testing**
   - Connect USB-C
   - Check for 3.3V rail
   - Program ESP32
   - Test each subsystem

4. **Final Assembly**
   - Install switches and keycaps
   - Connect display
   - Add battery
   - Enjoy your creation!

## Step 4: Programming

### Arduino IDE:
```
1. Install ESP32 board support
2. Select "ESP32S3 Dev Module"
3. Load example code (or write your own!)
4. Upload via USB-C
```

### Example Features to Program:
- LoRa text messaging
- OLED menu system
- LED status indicators
- Haptic feedback patterns
- Battery level monitoring

## Costs Breakdown

| Item | Cost (USD) |
|------|------------|
| PCBs (5x) | $40-60 |
| Components | $30-50 |
| Battery & Accessories | $10-15 |
| **Total** | **$80-125** |

You'll have parts to build 5 boards! Share with friends or sell extras.

## Timeline

- **Order PCBs:** Day 0
- **Order Components:** Day 0-1
- **Receive PCBs:** Day 7-12
- **Receive Components:** Day 7-20 (depending on source)
- **Assembly:** Day 21
- **Testing & Programming:** Day 22
- **Done!** Day 23

## Need Help?

- Read the full `ASSEMBLY_INSTRUCTIONS.md` for detailed steps
- Check `PCB_DESIGN_SPEC.md` for technical details
- Review `VISUAL_REFERENCE.md` for component placement

## Pro Tips

1. **Order extra components** (especially small SMD parts - easy to lose!)
2. **Use solder paste and hot plate** for SMD assembly (much easier than hand soldering)
3. **Test as you go** - don't wait until everything is soldered
4. **Join maker communities** - Reddit r/cyberDeck, Discord servers
5. **Document your build** - take photos and share!

## Legal Reminder

⚠️ Check your local regulations for LoRa transmission!
- USA: 902-928 MHz is unlicensed ISM band
- EU: Different frequency (check your country)
- Some regions may require amateur radio license

---

**Ready? Let's build something amazing!**

The files in this package contain everything you need. Upload the Gerber files, order the parts, and in a few weeks you'll have your own beautiful, tactile communication device.

Welcome to the maker community! 🔧✨
