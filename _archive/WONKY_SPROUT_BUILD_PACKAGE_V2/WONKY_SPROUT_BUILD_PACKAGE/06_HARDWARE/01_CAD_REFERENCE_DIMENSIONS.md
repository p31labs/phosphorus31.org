# PHENIX NAVIGATOR - CAD REFERENCE SHEET
## Quick Dimensions for 3D Modeling

**Device Overall:** 145mm (W) × 75mm (H) × 22mm (D)

---

## FRONT SHELL CUTOUTS

**Base rectangle:** 145mm × 75mm  
**Origin:** Top-left corner (0, 0)  
**All measurements from origin**

### Top Edge (Y = 0-8mm)
```
L-Trigger:    14mm square, center at (15mm, 4mm)
Antenna SMA:  7mm circle, center at (72.5mm, 4mm)
R-Trigger:    14mm square, center at (130mm, 4mm)
```

### Left Controls (X = 3-18mm)
```
Rocker switch:  15mm × 8mm, center at (10.5mm, 17mm)
Red mech switch: 14mm square, center at (10mm, 50mm)
```

### Center Visual Unit (X = 34-111mm)
```
Screen window:   77mm × 52mm, top-left at (34mm, 9mm)
LED diffusion:   65mm × 4mm, top-left at (40mm, 63mm)
```

### Right Controls (X = 127-142mm)
```
Encoder shaft:    8mm circle, center at (135mm, 17mm)
Green mech switch: 14mm square, center at (135mm, 50mm)
```

### Bottom Edge (Y = 67-75mm)
```
USB-C port:  10mm × 4mm slot, center at (60mm, 71mm)
E-Stop:      17mm circle, center at (130mm, 71mm)
             (Recessed 2mm into case)
```

---

## INTERNAL FEATURES

### Screen Mounting
```
Position: 3mm depth from front face
Size: 85mm × 70mm mounting shelf
Lip: 1mm around screen window for flush fit
```

### LED Channel
```
Position: 8mm depth from front face
Size: 80mm × 5mm × 3mm deep
Purpose: Holds LED strip (59mm stick)
Diffusion: 1mm thick PETG front window
```

### Screw Posts
```
Quantity: 4 corners minimum (6-8 recommended)
Type: M3 brass heat-set insert
Position: 3-5mm from edges
Height: 10mm (through both shells)
```

### Battery Recess (Back Shell)
```
Size: 60mm × 50mm × 6mm deep
Position: Center of back shell
Purpose: Flat LiPo battery cradle
```

### Dead Man Sensor Pocket (Back Shell)
```
Size: 20mm × 20mm × 3mm deep
Position: Center (where hand rests)
Purpose: TTP223 capacitive sensor
```

---

## PRINT SETTINGS

```
Material:      Clear PETG or Natural PLA
Layer Height:  0.2mm
Walls:         6 perimeters (for diffusion)
Infill:        0% (hollow for light)
Top/Bottom:    4 layers (1mm thick)
Support:       Screen window overhang only
Bed Temp:      80°C (PETG) or 60°C (PLA)
Print Temp:    215°C (PETG) or 200°C (PLA)
Speed:         40-50mm/s
```

---

## CLEARANCES & TOLERANCES

```
Screen fit:     +0.2mm (slightly loose for easy install)
Switch holes:   Exact size (14mm for 14mm switch)
Encoder:        +0.5mm (8.5mm hole for 8mm shaft)
E-Stop:         +1mm (17mm hole for 16mm button)
Antenna:        +0.5mm (7.5mm hole for 7mm thread)
USB-C:          +1mm width (11mm for 10mm connector)
```

---

## ASSEMBLY NOTES

1. **Test print flat template first** (2mm thick, all holes, no depth)
2. **Test-fit components** before full 10-hour print
3. **Install heat-set inserts** immediately after printing (while warm)
4. **Print front shell support-side-up** (screen window faces down)
5. **Print back shell curved-side-down** (smooth finish visible)

---

## FILE NAMING CONVENTION

```
Phenix_Front_v[X]_FINAL.stl
Phenix_Back_v[X]_FINAL.stl
Phenix_Chassis_v[X].stl
Phenix_Test_Template_v[X].stl
```

Version numbers increment with each revision.
"FINAL" only on confirmed working designs.

---

**CRITICAL REMINDER:**

Screen + LED strip = ONE CENTERED VISUAL UNIT (77×58mm total)

This unit is centered on 145mm face:
- Left margin: 34mm
- Visual unit: 77mm  
- Right margin: 34mm

Controls flank this centered unit with 3mm gaps.
Symmetry is key.

---

*Quick reference for CAD work*
*Full build guide in 00_PHENIX_COMPLETE_BUILD_GUIDE.md*
