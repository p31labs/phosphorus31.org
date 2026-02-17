# Volume Encoder - 3D Printable Parts

**Node One Hardware Component**  
**License:** CC BY-SA 4.0  
**Version:** 1.0

---

## Overview

The Volume Encoder is a tactile control module for Node One (ESP32-S3). These 3D printable parts provide the physical enclosure and rotating knob for volume/parameter control with haptic feedback.

## Parts List

| Part | File | Description |
|------|------|-------------|
| **Case Bottom** | `obj_1_CaseBottom.stl` | Base enclosure housing the encoder electronics |
| **Rotating Knob** | `obj_2_RotatingKnob.stl` | Tactile control knob with detent feedback |
| **Full Assembly** | `obj_3_Assembly.stl` | Complete reference model (for visualization) |

## 3D Printing Instructions

### Recommended Settings

- **Layer Height:** 0.2mm (0.15mm for finer detail)
- **Infill:** 20% (grid or cubic pattern)
- **Supports:** Enabled (auto-generated)
- **Material:** PLA or PETG
- **Nozzle:** 0.4mm standard
- **Print Speed:** 50-60mm/s
- **Bed Temperature:** 60°C (PLA) / 80°C (PETG)
- **Hotend Temperature:** 210°C (PLA) / 240°C (PETG)

### Print Orientation

- **Case Bottom:** Print flat side down (no supports needed)
- **Rotating Knob:** Print with knob axis vertical (supports on internal features)
- **Assembly:** Reference only - do not print

### Post-Processing

1. **Remove supports** carefully with flush cutters
2. **Sand** any rough edges (320-400 grit)
3. **Test fit** before final assembly
4. **Optional:** Light sanding on knob surface for smooth rotation

## Assembly Instructions

### Required Components

- 1x Case Bottom (printed)
- 1x Rotating Knob (printed)
- 1x Rotary encoder module (EC11 or compatible)
- 1x M3x8mm screw (for encoder mounting)
- 1x M3x6mm screw (for knob attachment)
- 1x Small spring (for detent feel, if encoder doesn't include)

### Step-by-Step Assembly

1. **Prepare the encoder module**
   - Solder wires to encoder terminals (VCC, GND, CLK, DT, SW)
   - Test encoder functionality before assembly

2. **Mount encoder to case bottom**
   - Insert encoder through bottom opening
   - Secure with M3x8mm screw from inside
   - Ensure encoder shaft is centered and perpendicular

3. **Attach rotating knob**
   - Slide knob onto encoder shaft
   - Secure with M3x6mm set screw (if applicable)
   - Test rotation smoothness and detent feel

4. **Wire routing**
   - Route encoder wires through case opening
   - Leave sufficient slack for device connection
   - Secure wires to prevent strain

5. **Final check**
   - Verify smooth rotation (no binding)
   - Test detent clicks (should feel tactile)
   - Check wire connections are secure

## Integration with Node One

### Electrical Connection

Connect encoder to ESP32-S3 GPIO pins:

```
Encoder VCC  → 3.3V
Encoder GND  → GND
Encoder CLK  → GPIO (configurable)
Encoder DT   → GPIO (configurable)
Encoder SW   → GPIO (optional, button press)
```

### Firmware Configuration

See [Node One Hardware API](../../docs/api/node-one-hardware.md) for encoder initialization code.

### Haptic Feedback

The Volume Encoder works with Node One's DRV2605L haptic driver ("The Thick Click") to provide tactile feedback on detent clicks.

## Troubleshooting

### Knob doesn't rotate smoothly
- Check for support material remnants
- Verify encoder shaft alignment
- Lightly sand internal knob surface

### No detent feel
- Verify encoder has built-in detents
- Check spring installation (if applicable)
- Test encoder separately before assembly

### Loose fit
- Check print tolerances (may need to adjust model)
- Use thread locker on set screws
- Verify encoder shaft diameter matches knob

### Wire strain
- Add strain relief (zip tie or hot glue)
- Route wires through proper opening
- Leave sufficient slack

## Design Notes

- **Tolerance:** ±0.2mm for press-fit components
- **Material:** PLA recommended for prototyping, PETG for durability
- **Customization:** Models can be scaled/modified in CAD software
- **Accessibility:** Knob designed for easy grip with tactile feedback

## License

**Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)**

You are free to:
- Share — copy and redistribute the material
- Adapt — remix, transform, and build upon the material

Under the following terms:
- **Attribution** — You must give appropriate credit to P31 Labs
- **ShareAlike** — If you remix, you must license under CC BY-SA 4.0

See full license: https://creativecommons.org/licenses/by-sa/4.0/

## Support

- **Documentation:** [Node One Hardware Docs](../../docs/api/node-one-hardware.md)
- **Issues:** GitHub Issues (if applicable)
- **Community:** P31 Labs Discord/Forum (if applicable)

---

**The Mesh Holds. 🔺**

💜 With love and light. As above, so below. 💜
