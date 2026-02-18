# JLCPCB Assembly Service - Complete Ordering Guide

## Overview

This guide shows you exactly how to order Node-1 with **SMD components pre-assembled** by JLCPCB. You'll only need to hand-solder the easy through-hole parts (switches, headers).

**What JLCPCB will solder for you:**
- ✅ ESP32-S3 module (hard!)
- ✅ All resistors and capacitors (tiny!)
- ✅ All ICs (DRV2605L, TP4056, etc.)
- ✅ SK6812 LEDs (heat-sensitive!)
- ✅ USB-C connector (many pins!)
- ✅ Diodes and small SMD parts

**What you'll hand-solder:**
- ✋ Kailh Choc switches (2×) - Easy! Just plug into hotswap sockets
- ✋ Rotary encoder (1×) - 5 through-hole pins
- ✋ JST battery connector (1×) - 2 pins
- ✋ OLED display header (1×) - 4 pins

---

## Step-by-Step Ordering Process

### Step 1: Go to JLCPCB.com

Visit https://jlcpcb.com and click **"Order Now"**

---

### Step 2: Upload Gerber Files

1. Click **"Add gerber file"**
2. Upload the entire `gerbers/` folder as a ZIP
   - Or upload `node1_complete.zip` (the main package)
3. JLCPCB will automatically detect:
   - Dimensions: 51 × 51 mm ✓
   - Layers: 2 ✓

---

### Step 3: Configure PCB Settings

**Critical Settings - Get These Right!**

| Setting | Value | Why |
|---------|-------|-----|
| **PCB Qty** | 5 | Minimum order (you get 5 boards!) |
| **PCB Thickness** | 1.6 | Standard |
| **PCB Color** | **Matte Black** | Critical for aesthetic! |
| **Surface Finish** | **ENIG** | Gold touch zones require this! |
| **Gold Thickness** | 1 U" | Standard gold flash |
| **Remove Order Number** | Specify a location | Or "No" if available |

**Other Settings (use defaults):**
- Material: FR-4
- Outer Copper Weight: 1 oz
- Via Covering: Tented
- Min Track/Spacing: 6/6 mil

**Estimated cost for bare PCBs**: $25-35

---

### Step 4: Enable SMT Assembly

1. Scroll down and toggle **"SMT Assembly"** to ON
2. Select **"Assemble top side"** only
3. Choose **"Economic"** (cheaper) or **"Standard"** (faster)
4. Tooling holes: **Added by Customer** (we don't need them)

---

### Step 5: Click "Confirm" and Proceed

This takes you to the BOM matching page.

---

### Step 6: Upload BOM File

1. Click **"Add BOM File"**
2. Upload: `fabrication/BOM.csv`
3. JLCPCB will scan their parts library

---

### Step 7: Upload CPL (Component Placement) File

1. Click **"Add CPL File"**
2. Upload: `fabrication/node1_CPL.csv`
3. This tells them where each component goes

---

### Step 8: Component Matching

JLCPCB will show you a list of components and try to auto-match them.

**Important Notes:**

#### Parts LIKELY in JLCPCB Library ✅
- Resistors (0805)
- Capacitors (0805)
- TP4056 (charging IC)
- AMS1117-3.3 (voltage regulator)
- 1N5819 (diode)
- USB-C connector (check carefully!)

#### Parts MAYBE NOT in Library ⚠️
- **ESP32-S3-WROOM-1** - May need global sourcing or manual soldering
- **E22-900M30S LoRa module** - Probably not in library
- **DRV2605L** - May or may not be available
- **SK6812-SIDE LEDs** - Check carefully, might have WS2812 instead

#### Parts DEFINITELY NOT in Library ❌
- Kailh Choc switches (through-hole, you solder these)
- EC11 rotary encoder (through-hole, you solder this)
- JST connector (through-hole, you solder this)
- Pin headers (through-hole, you solder these)

---

### Step 9: Handle Missing Parts

For parts NOT in JLCPCB's library, you have options:

#### Option A: Global Sourcing (Expensive)
JLCPCB will buy the parts for you from Digikey/Mouser
- Adds $5-20 per unique part
- Convenient but pricey

#### Option B: Hand-Solder Later (Recommended)
Click **"Do not place"** for:
- ESP32-S3-WROOM-1 (order separately, solder yourself)
- E22-900M30S LoRa module (order from AliExpress, solder yourself)
- DRV2605L (order from Mouser, solder yourself)

These are relatively large and easier to hand-solder than tiny 0805 parts.

---

### Step 10: Review Component Placement

JLCPCB will show you a preview of where components will be placed.

**Check for:**
- ✓ All components are rotated correctly
- ✓ No components overlap
- ✓ Polarized components (diodes, LEDs) face the right way
- ✓ ICs are oriented correctly (check pin 1 marker)

If anything looks wrong, you can adjust rotation in the CPL file.

---

### Step 11: Confirm and Pay

- Review total cost
- **Expected total**: $80-150 depending on component sourcing
  - PCBs: $25-35
  - Assembly: $15-30
  - Components: $30-70
  - Shipping: $10-25

- Add to cart
- Checkout and pay

---

### Step 12: Production Time

- PCB Manufacturing: 2-3 days
- Component Sourcing: 1-2 days
- Assembly: 1-2 days
- QC Testing: 1 day
- **Total**: ~5-7 days

Plus shipping (3-7 days for DHL, 15-25 days for standard)

---

## What You'll Receive

You'll get **5 assembled PCBs** with:
- ✅ All SMD components soldered
- ✅ Tested for shorts/opens
- ⚠️ Some components may be missing (if not in their library)

---

## What to Do When Boards Arrive

### 1. Inspect the Boards
- Check solder quality
- Verify all SMD parts are present
- Look for any defects

### 2. Order Missing Components
If you skipped ESP32, LoRa, or other parts, order them now:
- **ESP32-S3-WROOM-1**: Mouser, Digikey
- **E22-900M30S**: AliExpress, eBay
- **Mechanical switches**: NovelKeys, Kailh
- **Battery**: Amazon, AliExpress

### 3. Hand-Solder Remaining Parts

**Order of assembly:**
1. ESP32-S3 module (if not assembled)
2. LoRa module (if not assembled)
3. Any missing SMD ICs
4. Kailh Choc hotswap sockets
5. Rotary encoder
6. JST battery connector
7. OLED header pins
8. Plug in switches (no soldering!)

### 4. Test!
- Connect USB-C
- Check for 3.3V rail
- Program ESP32
- Test all functions

---

## Cost Breakdown Example

**Scenario 1: Full Assembly (all parts in library)**
- PCBs (5×): $30
- Assembly service: $25
- Components sourced by JLCPCB: $60
- Shipping (DHL): $20
- **Total**: ~$135

**Scenario 2: Partial Assembly (you solder ESP32, LoRa)**
- PCBs (5×): $30
- Assembly service: $20
- Basic components only: $35
- Shipping: $15
- ESP32 modules (5×): $15
- LoRa modules (5×): $35
- **Total**: ~$150

**Scenario 3: No Assembly (bare PCBs only)**
- PCBs (5×): $35
- Shipping: $15
- All components (buy separately): $150-200
- **Total**: $200-250

**Recommendation**: Go with Scenario 2 for best value!

---

## Tips for Success

### 1. Double-Check Part Numbers
Match the parts in BOM.csv exactly with JLCPCB's library
- Wrong value components = non-functional board!

### 2. Verify Rotation
Common issue: ICs rotated 90° or 180°
- Use the preview to check orientation

### 3. Start Simple
If this is your first assembly order:
- Order just basic passives assembled
- Hand-solder the expensive/critical parts yourself
- Less risk if something goes wrong

### 4. Order Extra Boards
At 5 boards, cost per board is low
- Keep extras for future projects
- Give to friends
- Sell to cover costs

### 5. Test Before Installing Expensive Parts
- Solder cheap components first
- Test power rails
- Then add expensive modules (ESP32, LoRa)

---

## Alternative: Other Assembly Services

If JLCPCB doesn't have the parts you need:

### PCBWay Assembly
- Larger parts library
- More expensive (~$50-100 more)
- Better for prototypes
- https://pcbway.com

### MacroFab (USA)
- US-based, very fast
- Most expensive option
- Great for urgent orders
- https://macrofab.com

### Local Assembly Shop
- Search "PCB assembly near me"
- Often willing to solder from parts you provide
- Good for learning and support

---

## Troubleshooting Common Issues

### Issue: "Part not in library"
**Solution**: 
- Use global sourcing (expensive)
- Hand-solder it yourself (recommended)
- Find alternative part that IS in library

### Issue: "CPL file rejected"
**Solution**: 
- Check file format (must be CSV)
- Verify column headers match JLCPCB format
- Re-download node1_CPL.csv from this package

### Issue: "Component orientation wrong"
**Solution**: 
- Adjust rotation values in CPL file
- Common rotations: 0°, 90°, 180°, 270°

### Issue: "Assembly costs more than expected"
**Solution**: 
- Remove expensive parts from assembly
- Hand-solder rare/expensive components
- Use "Economic" assembly instead of "Standard"

---

## Support

If you have questions:
1. Check JLCPCB's assembly FAQ: https://jlcpcb.com/help/category/pcb-assembly-58
2. Contact JLCPCB support (they're very helpful!)
3. Review the Node-1 documentation in this package
4. Ask in maker forums (Reddit r/PrintedCircuitBoard)

---

## Ready to Order?

**Checklist:**
- [ ] Read this guide completely
- [ ] Have BOM.csv ready
- [ ] Have CPL file ready
- [ ] Have gerbers folder ready
- [ ] JLCPCB account created
- [ ] Payment method ready
- [ ] Shipping address confirmed

**Go to**: https://jlcpcb.com/quote

**Good luck with your order! You're about to get some beautiful PCBs!** ✨

---

*Node-1 v1.0 | JLCPCB Assembly Guide*
