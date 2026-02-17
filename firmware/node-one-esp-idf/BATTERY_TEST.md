# Battery Test Guide

## Quick Test Methods

### 1. HTTP API Test (Recommended)

Connect to the WiFi AP (`P31-NodeOne`) and call the battery test endpoint:

```bash
# Using curl
curl http://192.168.4.1/api/battery/test

# Expected response:
{
  "voltage_mv": 3850,
  "percentage": 75,
  "charging": false,
  "discharging": true,
  "charging_done": false,
  "voltage_v": 3.85,
  "health": "good",
  "state": "discharging",
  "timestamp_ms": 1234567890
}
```

### 2. Status API (Includes Battery)

```bash
curl http://192.168.4.1/api/status

# Battery fields in response:
{
  "battery_pct": 75,
  "battery_mv": 3850,
  "battery_charging": false,
  "battery_discharging": true,
  "battery_charging_done": false,
  ...
}
```

### 3. Serial Monitor Test

The firmware logs battery status on boot and periodically:

```
I (1234) node_one: Battery: 75% (3850 mV)
I (5678) bsp: Battery voltage: 3850 mV
```

### 4. Display Test

The display shows battery percentage and charging indicator in the status bar (updated every 5 seconds).

## Test Scenarios

### Test 1: Normal Operation
- Device running on battery
- Expected: `discharging: true`, `charging: false`
- Voltage should be between 3000-4200 mV
- Percentage should match voltage curve

### Test 2: Charging
- Connect USB power
- Expected: `charging: true`, `discharging: false`
- Voltage should increase over time
- Percentage should increase

### Test 3: Fully Charged
- Leave on charger until full
- Expected: `charging_done: true`, `charging: false`
- Voltage should be ~4200 mV
- Percentage should be 100%

### Test 4: Low Battery
- Let battery drain
- Expected: Voltage drops below 3500 mV
- Percentage should decrease accordingly
- Health status should change to "low" or "critical"

## Battery Specifications

- **Type**: Li-ion (typical)
- **Voltage Range**: 2600-4200 mV
- **Nominal Voltage**: 3700 mV (50%)
- **Full Charge**: 4200 mV (100%)
- **Cutoff**: 3000 mV (0%)

## Calibration Notes

The battery percentage calculation uses a linear approximation:
- 4200 mV = 100%
- 3700 mV = 50%
- 3000 mV = 0%

For more accurate readings, the conversion factor in `bsp_battery_voltage()` (line 303) may need calibration based on actual hardware measurements.

## Troubleshooting

### Battery reads 0%
- Check I2C bus initialization
- Verify AXP2101 is detected on I2C bus (address 0x34)
- Check BSP initialization order (must be after I2C bus)

### Voltage seems incorrect
- Verify ADC register addresses (0x78, 0x79) match AXP2101 datasheet
- Check conversion factor (currently 0.8 mV/LSB)
- May need calibration based on actual hardware

### Charging status incorrect
- Verify AXP2101 status register (0x01) bit mapping
- Check power management initialization
- Ensure USB power is connected for charging test

## API Endpoints

- `GET /api/battery/test` - Detailed battery test information
- `GET /api/status` - General status including battery info

## The Mesh Holds. 🔺
