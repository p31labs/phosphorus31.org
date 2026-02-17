# Hardware Documentation

**P31 Labs Open Hardware**  
**Node One (ESP32-S3) Physical Components**

---

## Overview

This directory contains documentation for all 3D printable and physical hardware components for Node One.

## Documentation Index

### 3D Printing

- **[3D Printing Guide](./3d-printing-guide.md)** — Complete guide to printing and assembling 3D printable parts
- **[Volume Encoder Assembly](../../VolumeEncoderParts_stls/README.md)** — Specific instructions for Volume Encoder module

### Hardware Components

- **[Node One Hardware API](../api/node-one-hardware.md)** — Communication protocols, pin mappings, I2C addresses
- **[Phenix Hardware Overview](../PHENIX_HARDWARE.md)** — Project Phenix hardware layer overview

### Related Documentation

- **[Node One](../node-one.md)** — Main Node One documentation
- **[Whale Channel](../whale-channel.md)** — LoRa mesh networking
- **[The Thick Click](../thick-click.md)** — Haptic feedback system

## Available 3D Printable Parts

### Volume Encoder Module

**Location:** `VolumeEncoderParts_stls/`

Components for tactile volume/parameter control:
- Case Bottom — Base enclosure
- Rotating Knob — Control interface
- Full Assembly — Reference model

**Quick Start:**
1. Download STL files from `VolumeEncoderParts_stls/`
2. Print using recommended settings (see [3D Printing Guide](./3d-printing-guide.md))
3. Follow [Assembly Instructions](../../VolumeEncoderParts_stls/README.md)
4. Integrate with Node One using [Hardware API](../api/node-one-hardware.md)

## Print Settings Quick Reference

```yaml
Layer Height: 0.2mm (0.15mm for fine detail)
Infill: 20% (grid or cubic)
Material: PLA (prototyping) or PETG (production)
Supports: Auto-generated (tree supports preferred)
Print Speed: 50-60mm/s
First Layer: 20-30mm/s
Bed Temp: 60°C (PLA) / 80°C (PETG)
Hotend: 210°C (PLA) / 240°C (PETG)
```

**Estimated Print Times:**
- Volume Encoder Case: ~1-2 hours
- Volume Encoder Knob: ~30-45 minutes
- **Total per set:** ~2-3 hours

See [3D Printing Guide](./3d-printing-guide.md) for detailed settings, calibration, and troubleshooting.

## License

All hardware designs are licensed under **CC BY-SA 4.0**.

- ✅ Share and redistribute
- ✅ Adapt and remix
- ✅ Use commercially
- ⚠️ Attribution required
- ⚠️ ShareAlike — derivatives must use same license

Full license: https://creativecommons.org/licenses/by-sa/4.0/

## Contributing

To contribute new 3D printable parts:

1. Design parts following P31 Labs design principles
2. Test prints and document settings
3. Create assembly instructions
4. Submit via pull request or issue

## Support

- **Documentation Issues:** Open GitHub issue
- **Print Problems:** Check [Troubleshooting](./3d-printing-guide.md#troubleshooting)
- **Assembly Questions:** See component-specific README files

---

**The Mesh Holds. 🔺**

💜 With love and light. As above, so below. 💜
