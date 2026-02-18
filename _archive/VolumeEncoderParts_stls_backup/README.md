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
Encoder VCC  → 3.3V (or 5V if encoder supports it)
Encoder GND  → GND
Encoder CLK  → GPIO (e.g., GPIO10 - configurable)
Encoder DT   → GPIO (e.g., GPIO11 - configurable)
Encoder SW   → GPIO (e.g., GPIO12 - optional, button press)
```

**Note:** Use GPIO pins that support interrupts for best performance. Avoid pins used by display, I2C, or other critical functions.

### Firmware Configuration

Basic encoder setup example:

```cpp
#include <ESP32Encoder.h>

ESP32Encoder encoder;
const int CLK_PIN = 10;
const int DT_PIN = 11;
const int SW_PIN = 12;  // Optional button

void setup() {
  encoder.attachHalfQuad(CLK_PIN, DT_PIN);
  encoder.setCount(0);
  
  if (SW_PIN >= 0) {
    pinMode(SW_PIN, INPUT_PULLUP);
  }
}

void loop() {
  long position = encoder.getCount();
  // Handle position changes
  // Trigger haptic feedback on detent clicks
}
```

See [Node One Hardware API](../../docs/api/node-one-hardware.md) for complete integration details.

### Haptic Feedback

The Volume Encoder works with Node One's DRV2605L haptic driver ("The Thick Click") to provide tactile feedback on detent clicks. Configure haptic patterns to match encoder detent positions for enhanced tactile experience.

## Troubleshooting

### Knob doesn't rotate smoothly
**Symptoms:** Binding, grinding, or resistance when turning

**Solutions:**
- Check for support material remnants in shaft hole
- Verify encoder shaft alignment (should be perpendicular)
- Lightly sand internal knob surface with 400+ grit sandpaper
- Check for warping in printed part (may need to reprint)
- Verify shaft diameter matches (should be 6mm D-shaft)
- Apply small amount of lubricant (dry PTFE spray) if needed

### No detent feel
**Symptoms:** Smooth rotation without tactile clicks

**Solutions:**
- Verify encoder has built-in detents (EC11 standard has 20 detents per rotation)
- Check spring installation (if encoder uses external spring)
- Test encoder separately before assembly (connect to multimeter, rotate slowly)
- Verify encoder model (some encoders are "smooth" without detents)
- Check if detent mechanism is damaged

### Loose fit
**Symptoms:** Knob wobbles or slips on shaft

**Solutions:**
- Check print tolerances (part may be too large - may need to adjust model scale)
- Use thread locker (blue Loctite) on set screws
- Verify encoder shaft diameter matches knob (should be 6mm)
- Check set screw is properly tightened (don't over-tighten - may strip)
- Consider using heat-set inserts for more secure mounting

### Wire strain
**Symptoms:** Wires pull tight, connections break

**Solutions:**
- Add strain relief (zip tie or hot glue at exit point)
- Route wires through proper opening (not pinched)
- Leave sufficient slack (minimum 50mm inside case)
- Use flexible wire (stranded, not solid core)
- Secure wires with cable tie mounts inside case

### Encoder not responding
**Symptoms:** No signal when rotating

**Solutions:**
- Verify wiring connections (VCC, GND, CLK, DT)
- Check GPIO pin assignments in firmware
- Test encoder with multimeter (should see voltage changes on CLK/DT)
- Verify pull-up resistors (ESP32 has internal pull-ups, may need external)
- Check for short circuits or loose connections
- Verify encoder is getting power (3.3V or 5V depending on model)

### Print quality issues
**Symptoms:** Rough surfaces, layer lines, poor fit

**Solutions:**
- Calibrate printer (bed leveling, extrusion multiplier)
- Use recommended print settings (see 3D Printing Guide)
- Check filament quality (moisture, diameter consistency)
- Post-process with sanding (320-400 grit, then 600+ for smooth finish)
- Consider using acetone vapor smoothing (PETG/ABS only, well-ventilated area)

## Design Specifications

### Dimensions

- **Case Bottom:** ~40mm × 30mm × 15mm (approximate)
- **Rotating Knob:** ~25mm diameter × 12mm height (approximate)
- **Encoder Shaft:** 6mm D-shaft (standard EC11)
- **Mounting Holes:** M3 threaded inserts

### Tolerances

- **Press-fit components:** ±0.2mm
- **Threaded holes:** M3 standard pitch
- **Shaft clearance:** 0.1mm clearance for smooth rotation

### Material Recommendations

- **Prototyping:** PLA (easy to print, quick iterations)
- **Production:** PETG (durable, chemical resistant)
- **High-stress:** ABS (if enclosure available)
- **Accessibility:** Textured surfaces can be added via post-processing

### Print Time Estimates

- **Case Bottom:** ~1-2 hours (20% infill, 0.2mm layers)
- **Rotating Knob:** ~30-45 minutes (20% infill, 0.2mm layers)
- **Total:** ~2-3 hours for complete set

### Accessibility Features

- **Large knob diameter** for easy grip
- **Tactile detents** for non-visual feedback
- **Textured surface** options (can be added via sanding or coating)
- **High contrast** color options recommended
- **Haptic feedback** integration for enhanced accessibility

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
