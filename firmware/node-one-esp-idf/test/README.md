# 🧪 NODE ONE - MOCK TESTING FRAMEWORK

Unit testing framework for Node One firmware components **without physical hardware**.

---

## QUICK START

### Windows (PowerShell)

```powershell
cd test
.\run_tests.ps1
```

### Linux/Mac/WSL

```bash
cd test
gcc -o test_runner test_runner.c mock_hardware.c test_*.c -I. -I.. -lm
./test_runner
```

### Using CMake

```bash
cd test
mkdir build && cd build
cmake ..
make
./test_runner
```

---

## WHAT'S TESTED

### ✅ Component Tests

1. **BSP (Board Support Package)**
   - I2C bus initialization
   - Battery voltage reading
   - Battery percentage calculation
   - Power management (AXP2101)

2. **Audio Engine**
   - ES8311 codec initialization
   - I2S initialization
   - Audio recording
   - Audio playback

3. **LoRa Radio**
   - SPI initialization
   - BUSY pin handling
   - GPIO configuration

4. **Button Input**
   - MCP23017 initialization
   - Button press detection
   - Interrupt configuration

5. **Display**
   - GPIO configuration
   - Backlight control

---

## MOCK HARDWARE API

The mock hardware layer provides simulated implementations of:

- **GPIO** - Pin states, levels, interrupts
- **I2C** - Register read/write, device simulation
- **I2S** - Audio buffer simulation
- **SPI** - Transfer simulation
- **Timer** - Time simulation (advanceable)
- **Battery** - Voltage and charging state

See `mock_hardware.h` for full API documentation.

---

## TEST STRUCTURE

```
test/
├── mock_hardware.h          # Mock hardware API
├── mock_hardware.c          # Mock hardware implementation
├── test_runner.c            # Test runner main
├── test_bsp.c              # BSP tests
├── test_audio.c             # Audio engine tests
├── test_lora.c              # LoRa radio tests
├── test_buttons.c           # Button input tests
├── test_display.c           # Display tests
├── run_tests.ps1            # Windows test runner
├── CMakeLists.txt           # CMake build config
└── RUN_MOCK_TESTS.md        # Detailed documentation
```

---

## WRITING TESTS

### Example Test

```c
bool test_my_component(void) {
    printf("  Testing my component...\n");
    
    // Reset all mocks
    mock_hardware_reset_all();
    
    // Initialize component (using mocks)
    // ... test code ...
    
    // Verify results
    if (/* condition */) {
        printf("    ❌ Test failed\n");
        return false;
    }
    
    printf("    ✅ Test passed\n");
    return true;
}
```

### Add to Test Runner

1. Declare in `test_runner.c`:
```c
extern bool test_my_component(void);
```

2. Add to `tests[]` array:
```c
{"My Component", "Description", test_my_component, false},
```

---

## EXPECTED OUTPUT

```
╔════════════════════════════════════════╗
║   NODE ONE - MOCK TEST SUITE           ║
║   Testing without hardware              ║
╚════════════════════════════════════════╝

=== Test 1/9: BSP Init ===
Description: Board Support Package initialization
Running... ✅ PASS

...

╔════════════════════════════════════════╗
║         TEST SUMMARY                   ║
╠════════════════════════════════════════╣
║  Tests Run:       9                   ║
║  Tests Passed:     9                   ║
║  Tests Failed:     0                   ║
╚════════════════════════════════════════╝

✅ ALL TESTS PASSED

The Mesh Holds. 🔺
```

---

## LIMITATIONS

**Mock tests verify:**
- ✅ Component logic
- ✅ Register operations
- ✅ State machines
- ✅ Data flow
- ✅ Error handling

**Mock tests do NOT verify:**
- ❌ Hardware timing
- ❌ Physical connections
- ❌ Real I2C/SPI communication
- ❌ Actual performance

**For hardware tests, use `BENCH_TEST_CHECKLIST.md`**

---

## CI/CD INTEGRATION

### GitHub Actions

```yaml
- name: Run Mock Tests
  run: |
    cd firmware/node-one-esp-idf/test
    gcc -o test_runner *.c -I. -I.. -lm
    ./test_runner
```

---

## TROUBLESHOOTING

**No compiler found:**
- Install MinGW-w64, Clang, or use WSL
- Or use Linux/Mac for native compilation

**Tests fail:**
- Check mock hardware initialization
- Verify test data
- Review component logic

**Tests pass but hardware fails:**
- Mock tests verify logic, not hardware
- Use bench tests for hardware verification

---

💜 **With love and light. As above, so below.** 💜  
🔺 **The Mesh Holds.** 🔺

*P31 Labs - Phosphorus-31*  
*Mock Testing Framework v0.1.0*
