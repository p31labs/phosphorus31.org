# 3D Printing Guide for Node One Hardware

**P31 Labs Open Hardware**  
**License:** CC BY-SA 4.0

---

## Overview

All Node One hardware components are designed for open-source manufacturing. This guide covers 3D printing, assembly, and integration of physical components.

## Available 3D Printable Parts

### Volume Encoder Module

**Location:** `VolumeEncoderParts_stls/`

- **Case Bottom** — Base enclosure
- **Rotating Knob** — Tactile control interface
- **Full Assembly** — Reference model

**Full Documentation:** [Volume Encoder README](../../VolumeEncoderParts_stls/README.md)

## General 3D Printing Guidelines

### Printer Requirements

- **FDM/FFF Printer** (standard desktop 3D printer)
- **Build Volume:** Minimum 150mm × 150mm × 100mm
- **Nozzle:** 0.4mm standard (0.6mm acceptable)
- **Bed:** Heated bed recommended

### Material Selection

| Material | Pros | Cons | Best For |
|----------|------|------|----------|
| **PLA** | Easy to print, low warping, biodegradable | Less durable, lower temp resistance | Prototyping, indoor use |
| **PETG** | Strong, flexible, chemical resistant | Requires higher temps, stringing | Production, outdoor use |
| **ABS** | Very durable, high temp resistance | Warping, fumes, requires enclosure | High-stress applications |
| **TPU** | Flexible, impact resistant | Difficult to print, slow | Gaskets, flexible parts |

**Recommendation:** Start with PLA for prototyping, use PETG for production builds.

### Print Settings Template

```yaml
# General Settings
Layer Height: 0.2mm (0.15mm for fine detail, 0.3mm for draft)
Infill: 20% (grid or cubic pattern)
Supports: Auto-generated (tree supports preferred)
Print Speed: 50-60mm/s
First Layer Speed: 20-30mm/s
Travel Speed: 150mm/s

# Retraction (critical for stringing)
Retraction Distance: 5mm (direct drive) / 6-8mm (Bowden)
Retraction Speed: 45mm/s
Z-Hop: 0.2mm (optional, helps with stringing)

# Cooling
Fan Speed: 100% after first layer
Fan Speed First Layer: 0% (for better adhesion)

# Temperature (material dependent)
Hotend: 210°C (PLA) / 240°C (PETG) / 250°C (ABS)
Bed: 60°C (PLA) / 80°C (PETG) / 100°C (ABS)

# Quality
Top/Bottom Layers: 4-5 layers
Wall Thickness: 2-3 perimeters (0.8-1.2mm total)
```

### Calibration Checklist

Before printing Node One parts, calibrate your printer:

- [ ] **Bed Leveling** — Paper test at all corners and center
- [ ] **Extrusion Multiplier** — Print calibration cube, measure walls
- [ ] **Temperature Tower** — Find optimal temperature for your filament
- [ ] **Retraction Test** — Minimize stringing without under-extrusion
- [ ] **First Layer** — Perfect adhesion, no gaps or elephant's foot
- [ ] **Dimensional Accuracy** — Print test cube, verify ±0.1mm accuracy

### Quality Checklist

- [ ] First layer adhesion is good (no warping)
- [ ] Overhangs print cleanly (supports if needed)
- [ ] Surface finish is smooth (no stringing)
- [ ] Dimensional accuracy within ±0.2mm
- [ ] Threads/holes are clean (no blobs)
- [ ] Supports remove easily

## Assembly Best Practices

### Pre-Assembly

1. **Clean parts** — Remove all supports and sand rough edges
2. **Test fit** — Dry-fit components before final assembly
3. **Check tolerances** — Verify press-fit parts fit correctly
4. **Prepare hardware** — Have all screws, wires, and components ready

### Tool Requirements

- **Flush cutters** — Remove supports
- **Sandpaper** — 320-400 grit for smoothing
- **Screwdrivers** — M2, M3 sizes
- **Soldering iron** — For electronics connections
- **Multimeter** — For continuity testing

### Safety

- **Ventilation** — Print in well-ventilated area
- **Eye protection** — When removing supports
- **Heat safety** — Hotend and bed are hot during printing
- **Fumes** — ABS requires enclosure and ventilation

## Integration with Node One

### Hardware Compatibility

All 3D printed parts are designed to work with:
- **ESP32-S3** development board
- **Waveshare ESP32-S3 Touch LCD 3.5"** (Type B)
- Standard rotary encoders (EC11 compatible)
- DRV2605L haptic driver modules

### Electrical Integration

See [Node One Hardware API](../api/node-one-hardware.md) for:
- GPIO pin assignments
- I2C device addresses
- Power management setup
- Serial communication protocols

### Firmware Integration

3D printed enclosures accommodate:
- USB-C connector access
- Display mounting
- Button/encoder access
- LoRa antenna clearance
- Haptic motor mounting

## Customization

### Scaling Parts

Most parts can be scaled in your slicer, but note:
- **Threads** — Don't scale threaded parts (use correct size)
- **Tolerances** — May need adjustment after scaling
- **Clearances** — Check fit with scaled components

### Material Modifications

- **Color** — Any color works (PLA/PETG available in many colors)
- **Transparency** — Clear PETG for display windows
- **Strength** — Increase infill to 40-50% for high-stress parts
- **Flexibility** — TPU for gaskets or flexible mounts

### Design Modifications

All STL files can be:
- Imported into CAD software (Fusion 360, FreeCAD, Blender)
- Modified for custom requirements
- Remixed for different applications
- Shared under CC BY-SA 4.0 license

## Troubleshooting

### Common Print Issues

**Warping/Bed Adhesion**
- Clean bed with isopropyl alcohol
- Use brim or raft
- Increase first layer temperature
- Check bed leveling

**Stringing/Oozing**
- Increase retraction distance
- Lower print temperature
- Enable "coasting" in slicer
- Check nozzle for clogs

**Layer Shifting**
- Tighten belts
- Check stepper motor current
- Reduce print speed
- Check for mechanical obstructions

**Poor Overhangs**
- Enable supports
- Reduce layer height
- Increase cooling fan speed
- Orient part differently

### Assembly Issues

**Parts don't fit**
- Check print scale (should be 100%)
- Verify dimensional accuracy
- Sand/adjust tolerances
- Check for support material remnants

**Threads don't work**
- Clean threads with tap/die
- Use correct screw size
- Check thread orientation
- Consider heat-set inserts

## Future Parts

Planned 3D printable components for Node One:

### Enclosures
- [ ] **Main Node One enclosure** — Full device housing with display cutout
- [ ] **Battery holder/case** — Secure battery mounting with charging access
- [ ] **Carrying case** — Protective case for transport

### Mounts & Brackets
- [ ] **LoRa antenna mount** — Secure antenna positioning for optimal range
- [ ] **Haptic motor bracket** — DRV2605L mounting bracket with vibration isolation
- [ ] **Display bezel/frame** — Protective frame for 3.5" touchscreen

### Accessories
- [ ] **Stand/base** — Desktop stand for stationary use
- [ ] **Wall mount** — Secure wall mounting bracket
- [ ] **Cable management** — Clips and guides for cable routing

**Status:** Designs in progress. Check GitHub for updates.

**Contributing:** Have a design idea? See [Contributing Guidelines](#contributing) below.

## Cost Estimates

### Material Costs (per part set)

- **PLA Filament:** ~$20/kg (Volume Encoder uses ~50g = ~$1)
- **PETG Filament:** ~$25/kg (Volume Encoder uses ~50g = ~$1.25)
- **Electricity:** ~$0.10-0.20 per hour (2-3 hours = ~$0.30)

**Total per Volume Encoder set:** ~$1.50-2.00 (PLA) or ~$1.75-2.25 (PETG)

### Printer Investment

- **Entry-level FDM:** $200-400 (Ender 3, Prusa Mini)
- **Mid-range:** $400-800 (Prusa i3, Voron)
- **Professional:** $1000+ (Prusa XL, Ultimaker)

**Recommendation:** Start with entry-level for Node One parts. Upgrade if you plan extensive customization.

## Resources

### Software

**Slicers (Free):**
- **PrusaSlicer** — Excellent for beginners, great tree supports
- **Cura** — Most popular, extensive plugin ecosystem
- **SuperSlicer** — Advanced features, PrusaSlicer fork

**CAD Software:**
- **Fusion 360** — Free for hobbyists, professional features
- **FreeCAD** — Open source, parametric modeling
- **Blender** — Free, excellent for organic shapes
- **OpenSCAD** — Code-based modeling

**STL Repair & Analysis:**
- **Netfabb** — Online STL repair (Autodesk)
- **Meshmixer** — Mesh editing and repair
- **3D Builder** — Windows built-in STL repair

### Communities & Marketplaces

- **r/3Dprinting** — Reddit community (1M+ members)
- **Printables** — Model sharing by Prusa (high quality)
- **Thingiverse** — Largest model repository
- **MyMiniFactory** — Curated, high-quality models
- **P31 Labs GitHub** — Project-specific support and issues

### Learning Resources

- **Teaching Tech** — YouTube calibration guides
- **CNC Kitchen** — Material testing and optimization
- **Maker's Muse** — Design and printing tutorials
- **3D Printing Nerd** — Reviews and news

### Documentation

- [Node One Hardware API](../api/node-one-hardware.md) — GPIO, I2C, communication protocols
- [Volume Encoder Assembly](../../VolumeEncoderParts_stls/README.md) — Specific assembly guide
- [Phenix Hardware Overview](../PHENIX_HARDWARE.md) — Project Phenix hardware layer
- [Node One Documentation](../node-one.md) — Complete Node One overview

## License

All 3D printable designs are licensed under **Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)**.

**You are free to:**
- Share and redistribute
- Adapt and remix
- Use commercially

**Under these terms:**
- Attribution to P31 Labs required
- ShareAlike — derivatives must use same license

Full license: https://creativecommons.org/licenses/by-sa/4.0/

---

**The Mesh Holds. 🔺**

💜 With love and light. As above, so below. 💜
