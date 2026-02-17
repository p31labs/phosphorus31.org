# 🧪 Battle Test Quick Start

## Quick Run

```bash
cd firmware/node-one-esp-idf
./run_battle_test.sh
```

## Manual Steps

### 1. Build
```bash
idf.py build
```

### 2. Flash
```bash
idf.py flash
```

### 3. Monitor (Tests run automatically)
```bash
idf.py monitor
```

## Test Coverage

✅ **Initialization** - Radio init, double init, state checks  
✅ **Transmission** - Small, large, max size packets, error cases  
✅ **Reception** - RX mode, callbacks, packet handling  
✅ **Configuration** - Frequency, power, RSSI reading  
✅ **Power Management** - Sleep mode, wake up  
✅ **Stress Test** - Rapid TX, long RX sessions  
✅ **Error Handling** - Invalid states, null pointers  

## Expected Output

```
╔════════════════════════════════════════╗
║   LORA RADIO BATTLE TEST SUITE        ║
║   Pre-Abdication Verification         ║
╚════════════════════════════════════════╝

=== Test 1: Initialization ===
✅ PASS: lora_radio_init() succeeds
✅ PASS: Double init handled gracefully
...

╔════════════════════════════════════════╗
║         TEST SUMMARY                   ║
╠════════════════════════════════════════╣
║  Tests Run:     25                     ║
║  Tests Passed:   25                     ║
║  Tests Failed:    0                     ║
╚════════════════════════════════════════╝

✅ ALL TESTS PASSED - READY FOR ABDICATION
```

## Success Criteria

- ✅ All initialization tests pass
- ✅ Basic TX/RX functionality works
- ✅ Error handling works correctly
- ✅ Stress tests complete without crashes
- ✅ No memory leaks detected

## Troubleshooting

### Build Fails
- Check ESP-IDF environment
- Verify all dependencies installed
- Check CMakeLists.txt configuration

### Flash Fails
- Check USB connection
- Verify device permissions
- Try `idf.py flash -p /dev/ttyUSB0` (Linux) or `COM3` (Windows)

### Tests Fail
- Verify hardware connected correctly
- Check power supply (5V for full power)
- Verify pin connections
- Check serial monitor output for errors

## Next Steps

After battle tests pass:
1. ✅ Review test results
2. ✅ Run abdication readiness check: `./verify_abdication_readiness.sh`
3. ✅ Proceed to 9:00 AM abdication

💜 **With love and light. As above, so below.** 💜
