# PHENIX NAVIGATOR - COMPLETE BILL OF MATERIALS
## Shopping List with Links & Specifications

**Total Budget:** ~$850 for 8 units
**Order Deadline:** TODAY (Nov 29) for critical path items

---

## PRIORITY 1: ORDER TODAY (Critical Path)

### Radios (LONGEST LEAD TIME)
```
Item:     CDEBYTE E22-900M30S LoRa Module
Chipset:  SX1262, 915MHz, 30dBm, SPI interface
Qty:      10 units (8 needed + 2 spare)
Cost:     $6.66 × 10 = $66.60
Vendor:   AliExpress (CDEBYTE IoT Module Store)
Lead:     Dec 17 arrival (18 days)
CRITICAL: Must be "M30S" (SPI) NOT "T30S" (UART)

Search term: "SX1262 LoRa Module High-Precision TCXO CDEBYTE E22"
Verify: 915MHz, SPI interface, 30dBm output
```

### Screens
```
Item:     Waveshare ESP32-S3 Touch LCD 3.5" Display
Type:     ESP32-S3R8, Capacitive Touch, Type B
Qty:      8 units
Cost:     $30 × 8 = $240
Vendor:   Amazon (Waveshare Official or authorized)
Lead:     Dec 5 arrival (first 4), Dec 9 (last 4)
CRITICAL: Must have 32-pin GPIO header on back

Amazon search: "Waveshare ESP32-S3 Touch LCD 3.5 Type B"
ASIN example: (verify "Type B" in listing)
Alternative: Adafruit, Mouser (if Amazon out)
```

### Batteries
```
Item:     3.7V Flat LiPo Battery 3000mAh
Size:     ~60mm × 50mm × 5mm (pouch cell)
Connector: MX1.25 2-pin
Qty:      8 units
Cost:     $12 × 8 = $96
Vendor:   Amazon
Lead:     Dec 1-5 arrival

Search: "3.7V 3000mAh LiPo Battery Flat MX1.25"
Verify: Samsung or LG cells preferred (avoid generic)
Alternative: 3500mAh if 3000mAh unavailable

ALSO ORDER:
MX1.25 2-pin Connector Pigtails (10-pack): ~$8
(If batteries don't come pre-wired)
```

**PRIORITY 1 SUBTOTAL: ~$411**

---

## PRIORITY 2: ORDER SUNDAY (Controls & Safety)

### Mechanical Switches
```
Item:     Gateron Blue or Green Switches (Clicky)
Type:     MX-compatible, clicky tactile
Qty:      35-pack (need 32: 4 per unit × 8)
Cost:     ~$15
Vendor:   Amazon
Lead:     Dec 1-3

Search: "Gateron Blue Switches 35 pack"
OR: "Gateron Green Switches" (heavier spring)
Verify: Cherry MX compatible mounting
```

### Keycaps
```
Item:     DSA Profile Keycaps 1u Blank
Colors:   Red (20), Green (20), Clear/White (20)
Type:     DSA profile (low, uniform)
Material: Translucent preferred (for LED glow)
Qty:      60 total
Cost:     ~$20
Vendor:   Amazon

Search: "DSA Keycaps 1u Blank Translucent"
OR: Buy color packs separately
Verify: Cherry MX stem compatible
```

### Rocker Switches
```
Item:     Mini Momentary Rocker Switch (SPDT)
Type:     (ON)-OFF-(ON) momentary both ways
Size:     15mm × 8mm panel mount
Terminals: 3-pin (center + two outer)
Qty:      8-10 units
Cost:     $3 × 10 = $30
Vendor:   Amazon

Search: "Mini Momentary Rocker Switch SPDT 3 Pin"
Search: "KCD1 Momentary Rocker Switch"
Verify: Momentary (not latching)
```

### Rotary Encoders
```
Item:     EC11 Rotary Encoder with Push Switch
Type:     5-pin, 20 PPR (pulses per revolution)
Shaft:    D-shaft, 20mm length
Switch:   Push-to-click integrated
Qty:      10 units
Cost:     $1.50 × 10 = $15
Vendor:   Amazon

Search: "EC11 Rotary Encoder 5 Pin 20mm"
Verify: Has push switch (5 pins total)
```

### Aluminum Knobs
```
Item:     Aluminum Potentiometer Knob
Size:     20mm diameter
Shaft:    6mm inner diameter (for encoder)
Finish:   Black or Silver (your choice)
Qty:      10 units
Cost:     $2 × 10 = $20
Vendor:   Amazon

Search: "Aluminum Knob 20mm 6mm Shaft"
Verify: Set screw or clamp type (for D-shaft)
```

### E-Stop Buttons
```
Item:     16mm Emergency Stop Push Button
Type:     Red mushroom head, latching, twist-unlock
Contacts: SPDT (1NO + 1NC) or just NC
Voltage:  12V-220V capable
Qty:      8 units
Cost:     $11.99 × 8 = $95.92
Vendor:   Amazon (ALREADY ORDERED)
Lead:     Dec 4 arrival

Verify: 16mm thread, latching type
Panel hole: 17mm (16mm + clearance)
```

### Dead Man's Switch Sensors
```
Item:     TTP223 Capacitive Touch Sensor Module
Type:     Digital output when touched
Voltage:  3.3V-5V compatible
Qty:      10 units
Cost:     $1.25 × 10 = $12.50
Vendor:   Amazon

Search: "TTP223 Capacitive Touch Sensor Arduino"
Verify: Module (not bare IC)
```

**PRIORITY 2 SUBTOTAL: ~$208**

---

## PRIORITY 3: ORDER MONDAY (Antennas & LEDs)

### Antenna Pigtails
```
Item:     IPEX (u.FL) to SMA Female Bulkhead Cable
Length:   15cm (6 inches)
Type:     RG1.13 or RG178 coax
Qty:      10 units
Cost:     $2 × 10 = $20
Vendor:   Amazon

Search: "IPEX uFL SMA Female Bulkhead Pigtail 15cm"
Verify: Female bulkhead (panel mount)
```

### External Antennas
```
Item:     915MHz LoRa Antenna SMA Male
Type:     Stubby 3dBi omnidirectional
Connector: SMA Male (threads into female bulkhead)
Length:   Stubby ~5-8cm (not long whip)
Qty:      10 units
Cost:     $4 × 10 = $40
Vendor:   Amazon

Search: "915MHz LoRa Antenna SMA Stubby"
Verify: 915MHz center freq, SMA male
```

### LED Strips
```
Item:     Amomii Glow LED Strips
Type:     8-pack individual sticks, WS2812B addressable
Specs:    8 LEDs per stick, 59mm length
Qty:      1 pack (covers all 8 units)
Cost:     $29.99
Vendor:   Amazon (ALREADY ORDERED)
Lead:     Dec 4-5 arrival

Each stick: 59mm × 9mm
Perfect fit under screen (65mm window)
```

**PRIORITY 3 SUBTOTAL: ~$90**

---

## PRIORITY 4: CONSUMABLES (Order Mon-Tue)

### Wiring
```
Item:     30AWG Silicone Wire Kit (6 colors)
Type:     Stranded, silicone insulation
Length:   ~25ft per color
Qty:      1 kit
Cost:     ~$15
Vendor:   Amazon

Search: "30AWG Silicone Wire Kit 6 Color"
Verify: Stranded (not solid), flexible
```

### Resistors
```
Item:     Resistor Kit Assortment
Values:   MUST include: 1kΩ, 2.2kΩ, 4.7kΩ, 10kΩ
Type:     1/4W metal film
Qty:      1 kit (assorted)
Cost:     ~$12
Vendor:   Amazon

Search: "Resistor Kit Assortment 1/4W"
Verify: Includes needed values for button ladder
```

### Heat-Set Inserts
```
Item:     M3 Brass Heat-Set Threaded Inserts
Size:     M3 × 4mm or M3 × 5mm length
Type:     Tapered/knurled for 3D prints
Qty:      50-100 pack
Cost:     ~$10
Vendor:   Amazon

Search: "M3 Brass Heat Set Inserts 3D Printing"
Use: 4-6 per unit × 8 units = 32-48 needed
```

### Screws
```
Item:     M3 × 6mm Button Head or Flat Head Screws
Material: Stainless steel
Qty:      50-100 pack
Cost:     ~$8
Vendor:   Amazon

Search: "M3 6mm Button Head Screws"
Use: Match heat-set inserts (4-6 per unit)
```

### Adhesives
```
Item:     Double-Sided Foam Tape (3M VHB or similar)
Width:    10mm
Strength: High bond
Qty:      1 roll
Cost:     ~$8
Vendor:   Amazon

Use: Battery mounting, LED strip mounting
```

### Heat Shrink Tubing
```
Item:     Heat Shrink Tubing Assortment
Sizes:    2mm, 3mm, 5mm, 10mm
Qty:      Assorted kit
Cost:     ~$8
Vendor:   Amazon

Search: "Heat Shrink Tubing Kit Assorted"
Use: Wire insulation, strain relief
```

### Solder & Flux
```
Item:     Solder (60/40 or lead-free)
Size:     100g spool
Type:     0.8mm or 1mm diameter
Qty:      1 spool (if running low)
Cost:     ~$10
Vendor:   Amazon

Item:     Flux (Rosin or no-clean)
Type:     Paste or liquid pen
Qty:      1 tube/pen
Cost:     ~$8
Vendor:   Amazon
```

### Kapton Tape
```
Item:     Kapton Polyimide Tape
Width:    10mm
Temp:     260°C heat resistant
Qty:      1 roll
Cost:     ~$8
Vendor:   Amazon

Use: High-temp masking, cable insulation
```

**PRIORITY 4 SUBTOTAL: ~$87**

---

## 3D PRINTING FILAMENT

```
Material:  Clear PETG or Natural PLA
Brand:     Overture Clear PETG preferred
           OR eSun Natural PLA
Qty:       2-3 kg (each unit ~200-250g)
Cost:      $20-25 per kg = $50-75 total
Vendor:    Amazon

Search: "Overture Clear PETG 1.75mm"
OR: "eSun Natural PLA 1.75mm"

CRITICAL: Must be clear/translucent (not opaque white)
Use: Diffuses internal LED light (ghost tech aesthetic)
```

---

## TOTAL BOM SUMMARY

```
Priority 1 (Order Today):      $411
Priority 2 (Order Sunday):     $208
Priority 3 (Order Monday):     $90
Priority 4 (Consumables):      $87
Filament:                      $60 (average)
────────────────────────────────────
TOTAL:                         $856

Budget:                        $1000
Remaining buffer:              $144
```

---

## DELIVERY TRACKING

**Create calendar events for:**

```
Dec 1 (Sun):   Controls arrive (switches, encoders, wire)
Dec 3 (Wed):   E-stops arrive
Dec 4 (Thu):   LEDs arrive
Dec 5 (Fri):   Screens arrive (first batch) - CRITICAL
Dec 9 (Tue):   Screens arrive (second batch) - CRITICAL
Dec 17 (Tue):  RADIOS ARRIVE - SPRINT STARTS
```

**Set phone reminders: "Check porch for packages" at 6pm daily**

---

## BACKUP VENDORS (If Primary Fails)

**Screens:**
- Adafruit
- Mouser
- Digikey
- Waveshare.com direct

**Radios:**
- AliExpress (multiple sellers)
- eBay (slower)
- RF Solutions (if desperate)

**Everything else:**
- Local electronics store (Microcenter, Fry's if available)
- Adafruit (higher cost but reliable)
- Digikey/Mouser (bulk, fast ship)

---

## VERIFICATION CHECKLIST

Before placing orders, verify:

**Radios:**
- [ ] Model: E22-900M30S (NOT T30S)
- [ ] Frequency: 915MHz
- [ ] Interface: SPI (NOT UART)
- [ ] Chipset: SX1262
- [ ] Quantity: 10 units

**Screens:**
- [ ] Size: 3.5 inch
- [ ] Touch: Capacitive (NOT resistive)
- [ ] Type: Type B (with GPIO header)
- [ ] Board: ESP32-S3R8
- [ ] Quantity: 8 units

**Batteries:**
- [ ] Voltage: 3.7V (single cell LiPo)
- [ ] Capacity: 3000mAh minimum
- [ ] Form: Flat pouch (NOT round 18650)
- [ ] Connector: MX1.25 or pigtails ordered
- [ ] Quantity: 8 units

**Switches:**
- [ ] Type: MX compatible
- [ ] Actuation: Clicky (Blue or Green)
- [ ] Quantity: 35+ (need 32)

**All orders:**
- [ ] Shipping address correct
- [ ] Payment method works
- [ ] Tracking enabled
- [ ] Confirmation emails saved

---

## COST OPTIMIZATION TIPS

**Where to save if over budget:**

1. **Filament:** Natural PLA instead of clear PETG (-$10)
2. **Knobs:** Plastic instead of aluminum (-$10)
3. **Spare parts:** Buy exactly 8 radios instead of 10 (-$13)
4. **Keycaps:** Single color instead of variety (-$10)

**Do NOT cheap out on:**
- Radios (must be correct model)
- Screens (must be Type B)
- Batteries (must be quality brand)
- Wire (silicone flex essential)

---

**SHOPPING LIST READY**

**Action:** Open Amazon, start adding to cart
**Priority:** Radios TODAY (critical path)
**Timeline:** All orders by Dec 1 to meet schedule

---

*Complete BOM for 8-unit build*
*Budget: $856 total for all components*
