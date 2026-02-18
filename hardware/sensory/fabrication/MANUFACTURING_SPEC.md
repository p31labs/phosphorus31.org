# Manufacturing Specification for JLCPCB/PCBWay

## Order Details
**Project Name:** Sensory Cyberdeck v1.0
**Designer:** [Your Name/Callsign]
**Date:** 2024-12-01
**Revision:** 1.0

## PCB Specifications

### Basic Information
- **Base Material:** FR-4
- **Layers:** 2
- **Dimensions:** 51 mm x 51 mm
- **PCB Qty:** 5 (minimum order)
- **Different Design:** 1

### PCB Thickness
- **Board Thickness:** 1.6 mm

### PCB Color
- **Solder Mask:** Matte Black (both sides)
- **Silkscreen:** White

### Surface Finish
- **Surface Finish:** ENIG (Electroless Nickel Immersion Gold)
- **Gold Thickness:** 1 U" (0.05 μm) - Standard
- **Nickel Thickness:** 120-240 U" (3-6 μm)
- **ENIG Type:** Standard ENIG

### Copper Weight
- **Outer Copper Weight:** 1 oz (35 μm)

### Via Covering
- **Via Covering:** Tented
- **Note:** Vias are tented (covered) on both sides

### Board Outline Tolerance
- **Outline Tolerance:** ±0.2 mm

### Confirm Production File
- **Confirm Production File:** Yes
- **Note:** Please review Gerber files before production

## Advanced Options

### Minimum Track/Spacing
- **Min Track Width:** 6 mil (0.15 mm)
- **Min Spacing:** 6 mil (0.15 mm)

### Minimum Hole Size
- **Min Hole Size:** 0.3 mm

### Remove Order Number
- **Remove Order Number:** Specify Location
- **Location:** Bottom silkscreen, lower right corner (if must be present)
- **Preferred:** No order number

### Flying Probe Test
- **Flying Probe Test:** Fully Test
- **Reason:** Critical for prototypes with fine-pitch components

### Gold Fingers
- **Gold Fingers:** No

### Castellated Holes
- **Castellated Holes:** No

### Edge Plating
- **Edge Plating:** No

### Paper Between PCBs
- **Paper Between PCBs:** Yes
- **Reason:** Protect ENIG surface from scratches

## Special Requirements

### Solder Mask Openings
**CRITICAL:** The following areas must have solder mask removed on the BOTTOM layer to expose bare ENIG gold for tactile "touch zones":

1. **Touch Zone 1 (Rectangular):**
   - Location: Bottom layer, center area
   - Coordinates: X: 25-40mm, Y: 10-25mm
   - Size: 15mm x 15mm
   - Purpose: Main tactile feedback area

2. **Touch Zone 2 (Circular):**
   - Location: Bottom layer, top-right corner
   - Center: X: 43mm, Y: 43mm
   - Diameter: 10mm
   - Purpose: Secondary tactile area

**Note to Manufacturer:** These are intentional solder mask openings for design purposes. They are NOT errors. The exposed copper should show the gold ENIG finish.

### Silkscreen Notes
- Use white silkscreen on matte black solder mask
- Ensure good contrast and readability
- Geometric patterns are intentional design elements
- Component labels should be clearly visible

### Quality Requirements
- No scratches on ENIG finish
- Even matte black solder mask finish
- Clean silkscreen printing (no smudges)
- Accurate board dimensions (±0.2mm tolerance)
- All holes properly drilled and plated

## File Checklist

Included Gerber files:
- [x] sensory_cyberdeck-F_Cu.gbr (Top Copper)
- [x] sensory_cyberdeck-B_Cu.gbr (Bottom Copper)
- [x] sensory_cyberdeck-F_Mask.gbr (Top Solder Mask)
- [x] sensory_cyberdeck-B_Mask.gbr (Bottom Solder Mask)
- [x] sensory_cyberdeck-F_SilkS.gbr (Top Silkscreen)
- [x] sensory_cyberdeck-B_SilkS.gbr (Bottom Silkscreen)
- [x] sensory_cyberdeck-Edge_Cuts.gbr (Board Outline)
- [x] sensory_cyberdeck.drl (Drill file)

## Estimated Cost (JLCPCB - 5pcs)
- PCB Manufacturing: ~$25-35 USD
- Shipping (DHL): ~$15-25 USD
- **Total Estimated:** ~$40-60 USD
- **Lead Time:** 3-5 days production + 3-7 days shipping

## Assembly Options
- **PCB Assembly:** Optional (can be ordered separately)
- **Component Sourcing:** Parts list provided in BOM.csv
- **Assembly Service:** Recommend partial assembly (SMD only)
- **Note:** Mechanical switches and connectors should be hand-soldered for best fit

## Important Notes for Manufacturer

1. **ENIG Finish Quality:** This is a premium consumer product. ENIG finish must be clean, smooth, and free of contamination.

2. **Matte Black Solder Mask:** The matte finish is essential for the aesthetic design. Glossy black is NOT acceptable.

3. **Touch Zones:** The exposed copper areas on the bottom are INTENTIONAL. Do not apply solder mask to these areas.

4. **Silkscreen Alignment:** Geometric patterns and component labels should be precisely aligned with component pads.

5. **Testing:** Please perform electrical testing to verify no shorts or opens in the circuit.

## Contact Information
For questions during manufacturing:
- Email: [your-email@example.com]
- Phone: [your-phone]
- Preferred Contact Method: Email

## Design Philosophy Note
This PCB is designed with "Cyberdeck" aesthetics in mind. The exposed traces, geometric patterns, and tactile gold zones are intentional design features that showcase the board as a finished product, not just a component. Please preserve these aesthetic elements during manufacturing.

---
**Approval Required Before Production:**
Please send photos of the first production unit for approval before manufacturing the full quantity.
