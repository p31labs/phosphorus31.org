# 🧪 MOCK TESTING - NODE ONE
## Unit Tests Without Hardware

This test suite allows you to test Node One firmware components without physical hardware.

---

## QUICK START

### Option 1: Native C Compilation (Linux/Mac/WSL)

```bash
cd test
gcc -o test_runner test_runner.c mock_hardware.c test_bsp.c test_audio.c test_lora.c test_buttons.c test_display.c -I. -I.. -lm
./test_runner
```

### Option 2: ESP-IDF Test Framework

```bash
cd firmware/node-one-esp-idf
idf.py build
idf.py test
```

### Option 3: CMake (Cross-platform)

```bash
cd test
mkdir build
cd build
cmake ..
make
./test_runner
```

---

## TEST COVERAGE

### ✅ BSP Tests
- I2C bus initialization
- Battery voltage reading
- Battery percentage calculation
- Charging status detection
- Power management (AXP2101)

### ✅ Audio Engine Tests
- ES8311 codec initialization
- I2S initialization
- Audio recording
- Audio playback
- Data integrity

### ✅ LoRa Radio Tests
- SPI initialization
- BUSY pin handling
- GPIO configuration
- SPI transfer

### ✅ Button Input Tests
- MCP23017 initialization
- IODIR configuration
- Pull-up configuration
- Button press detection
- Button release detection

### ✅ Display Tests
- GPIO configuration
- Backlight control
- QSPI configuration

---

## MOCK HARDWARE API

### GPIO Mock
```c
mock_gpio_init();
mock_gpio_set_level(gpio_num, level);
int level = mock_gpio_get_level(gpio_num);
mock_gpio_set_mode(gpio_num, mode);
mock_gpio_trigger_interrupt(gpio_num);
```

### I2C Mock
```c
mock_i2c_init();
mock_i2c_write_register(addr, reg, value);
uint8_t value = mock_i2c_read_register(addr, reg);
mock_i2c_set_device_register(addr, reg, value);
```

### I2S Mock
```c
mock_i2s_init();
size_t written = mock_i2s_write(data, samples);
size_t read = mock_i2s_read(data, max_samples);
mock_i2s_inject_audio(data, samples);  // For testing
```

### SPI Mock
```c
mock_spi_init();
mock_spi_transfer(tx_data, rx_data, length);
mock_spi_set_busy(busy);
```

### Timer Mock
```c
mock_timer_init();
uint64_t ms = mock_timer_get_time_ms();
mock_timer_advance_ms(100);  // Advance time for testing
```

### Battery Mock
```c
mock_battery_set_voltage(3700);  // 3.7V
uint16_t voltage = mock_battery_get_voltage();
mock_battery_set_charging(true);
```

---

## WRITING NEW TESTS

### Test Function Template

```c
bool test_my_component(void) {
    printf("  Testing my component...\n");
    
    // Initialize mocks
    mock_hardware_reset_all();
    
    // Test initialization
    // ... component init code ...
    
    // Verify state
    if (/* condition */) {
        printf("    ❌ Test failed\n");
        return false;
    }
    
    printf("    ✅ Test passed\n");
    return true;
}
```

### Add to Test Runner

1. Add function declaration to `test_runner.c`:
```c
extern bool test_my_component(void);
```

2. Add test case to `tests[]` array:
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

=== Test 2/9: BSP Battery ===
Description: Battery voltage and percentage
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

## INTEGRATION WITH CI/CD

### GitHub Actions Example

```yaml
name: Mock Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: sudo apt-get install -y gcc make
      - name: Run tests
        run: |
          cd test
          gcc -o test_runner *.c -I. -I.. -lm
          ./test_runner
```

---

## LIMITATIONS

### What Mock Tests CAN Do
- ✅ Test component initialization logic
- ✅ Test register read/write operations
- ✅ Test state machine logic
- ✅ Test data flow
- ✅ Test error handling
- ✅ Test configuration

### What Mock Tests CANNOT Do
- ❌ Test actual hardware timing
- ❌ Test real I2C/SPI communication
- ❌ Test physical button presses
- ❌ Test actual audio quality
- ❌ Test LoRa range/performance
- ❌ Test power consumption

**For hardware-specific tests, use `BENCH_TEST_CHECKLIST.md`**

---

## TROUBLESHOOTING

### Tests Fail to Compile
- Check compiler: `gcc --version`
- Verify all source files present
- Check include paths

### Tests Fail at Runtime
- Check mock hardware initialization
- Verify test data is correct
- Review test logic

### Tests Pass But Hardware Fails
- Mock tests verify logic, not hardware
- Use bench tests for hardware verification
- Check pin connections and wiring

---

💜 **With love and light. As above, so below.** 💜  
🔺 **The Mesh Holds.** 🔺

*P31 Labs - Phosphorus-31*  
*Mock Testing Framework v0.1.0*
