#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Node One - Python Mock Test Runner
Alternative test runner that doesn't require C compiler
Tests component logic through static analysis and verification
"""

import os
import re
import sys
from pathlib import Path

# Set UTF-8 encoding for Windows
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

class Colors:
    CYAN = '\033[96m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    GRAY = '\033[90m'
    RESET = '\033[0m'

def print_header():
    print(f"\n{Colors.CYAN}========================================")
    print("  NODE ONE - MOCK TEST SUITE")
    print("  Static Analysis & Verification")
    print(f"========================================{Colors.RESET}\n")

def test_file_exists(filepath, description):
    """Test if a required file exists"""
    path = Path(filepath)
    if path.exists():
        print(f"  [OK] {description}: {path.name}")
        return True
    else:
        print(f"  [FAIL] {description}: {path.name} NOT FOUND")
        return False

def test_pin_definitions():
    """Test pin definition consistency"""
    print(f"\n{Colors.YELLOW}=== Test: Pin Definitions ==={Colors.RESET}")
    print("  Checking pin_map.h for required definitions...")
    
    pin_map_path = Path("../main/pin_map.h")
    if not pin_map_path.exists():
        print(f"  {Colors.RED}[FAIL] pin_map.h not found{Colors.RESET}")
        return False
    
    content = pin_map_path.read_text()
    
    required_pins = [
        "PIN_LORA_SCK", "PIN_LORA_MOSI", "PIN_LORA_MISO", "PIN_LORA_NSS",
        "PIN_LORA_BUSY", "PIN_LORA_DIO1", "PIN_LORA_NRST",
        "PIN_LORA_TXEN", "PIN_LORA_RXEN",
        "I2S_MCLK", "I2S_BCLK", "I2S_LRCK", "I2S_DOUT", "I2S_DIN",
        "LCD_QSPI_CS", "LCD_QSPI_CLK", "LCD_QSPI_D0", "LCD_QSPI_D1",
        "LCD_QSPI_D2", "LCD_QSPI_D3", "LCD_BL",
        "BSP_I2C_SDA", "BSP_I2C_SCL",
        "PIN_MCP23017_INT"
    ]
    
    missing = []
    for pin in required_pins:
        if pin not in content:
            missing.append(pin)
    
    if missing:
        print(f"  {Colors.RED}[FAIL] Missing pin definitions:{Colors.RESET}")
        for pin in missing:
            print(f"     - {pin}")
        return False
    
    print(f"  {Colors.GREEN}[OK] All required pin definitions present{Colors.RESET}")
    return True

def test_component_includes():
    """Test that components include required headers"""
    print(f"\n{Colors.YELLOW}=== Test: Component Includes ==={Colors.RESET}")
    
    components = {
        "../components/audio_engine/audio_engine.c": ["pin_map.h", "audio_engine.h"],
        "../components/lora_radio/lora_radio.cpp": ["pin_config.h", "lora_radio.h"],
        "../components/button_input/button_input.c": ["pin_config.h", "button_input.h"],
        "../components/display/display.c": ["pin_map.h", "display.h"],
        "../components/bsp/bsp.c": ["bsp.h"],
    }
    
    all_pass = True
    for filepath, required_includes in components.items():
        path = Path(filepath)
        if not path.exists():
            print(f"  {Colors.RED}[FAIL] {path.name} not found{Colors.RESET}")
            all_pass = False
            continue
        
        content = path.read_text()
        missing = [inc for inc in required_includes if inc not in content]
        
        if missing:
            print(f"  {Colors.RED}[FAIL] {path.name} missing includes:{Colors.RESET}")
            for inc in missing:
                print(f"     - {inc}")
            all_pass = False
        else:
            print(f"  {Colors.GREEN}[OK] {path.name} includes correct headers{Colors.RESET}")
    
    return all_pass

def test_config_consistency():
    """Test configuration consistency"""
    print(f"\n{Colors.YELLOW}=== Test: Configuration Consistency ==={Colors.RESET}")
    
    config_path = Path("../main/node_one_config.h")
    if not config_path.exists():
        print(f"  {Colors.RED}[FAIL] node_one_config.h not found{Colors.RESET}")
        return False
    
    content = config_path.read_text()
    
    required_configs = [
        "NODE_ONE_DEVICE_NAME",
        "AUDIO_SAMPLE_RATE",
        "LORA_FREQUENCY",
        "WIFI_AP_SSID",
        "MCP23017_I2C_ADDR"
    ]
    
    missing = [cfg for cfg in required_configs if cfg not in content]
    
    if missing:
        print(f"  {Colors.RED}[FAIL] Missing configuration defines:{Colors.RESET}")
        for cfg in missing:
            print(f"     - {cfg}")
        return False
    
    print(f"  {Colors.GREEN}[OK] All required configurations present{Colors.RESET}")
    return True

def test_mock_hardware_completeness():
    """Test that mock hardware covers all interfaces"""
    print(f"\n{Colors.YELLOW}=== Test: Mock Hardware Completeness ==={Colors.RESET}")
    
    mock_h_path = Path("mock_hardware.h")
    if not mock_h_path.exists():
        print(f"  {Colors.RED}[FAIL] mock_hardware.h not found{Colors.RESET}")
        return False
    
    content = mock_h_path.read_text()
    
    required_functions = [
        "mock_gpio_init",
        "mock_gpio_set_level",
        "mock_gpio_get_level",
        "mock_i2c_init",
        "mock_i2c_write_register",
        "mock_i2c_read_register",
        "mock_i2s_init",
        "mock_i2s_write",
        "mock_i2s_read",
        "mock_spi_init",
        "mock_spi_transfer",
        "mock_timer_init",
        "mock_timer_get_time_ms",
        "mock_battery_set_voltage",
        "mock_battery_get_voltage"
    ]
    
    missing = [func for func in required_functions if func not in content]
    
    if missing:
        print(f"  {Colors.RED}[FAIL] Missing mock functions:{Colors.RESET}")
        for func in missing:
            print(f"     - {func}")
        return False
    
    print(f"  {Colors.GREEN}[OK] Mock hardware API complete{Colors.RESET}")
    return True

def test_file_structure():
    """Test that all required files exist"""
    print(f"\n{Colors.YELLOW}=== Test: File Structure ==={Colors.RESET}")
    
    required_files = {
        "../main/pin_map.h": "Pin map definitions",
        "../main/pin_config.h": "Pin configuration",
        "../main/node_one_config.h": "Device configuration",
        "../main/main.cpp": "Main application",
        "../components/bsp/bsp.c": "BSP implementation",
        "../components/bsp/include/bsp.h": "BSP header",
        "../components/audio_engine/audio_engine.c": "Audio engine",
        "../components/lora_radio/lora_radio.cpp": "LoRa radio",
        "../components/button_input/button_input.c": "Button input",
        "../components/display/display.c": "Display component",
        "mock_hardware.h": "Mock hardware header",
        "mock_hardware.c": "Mock hardware implementation",
        "test_runner.c": "C test runner",
    }
    
    all_pass = True
    for filepath, description in required_files.items():
        if not test_file_exists(filepath, description):
            all_pass = False
    
    return all_pass

def main():
    print_header()
    
    tests = [
        ("File Structure", test_file_structure),
        ("Pin Definitions", test_pin_definitions),
        ("Component Includes", test_component_includes),
        ("Configuration Consistency", test_config_consistency),
        ("Mock Hardware Completeness", test_mock_hardware_completeness),
    ]
    
    passed = 0
    failed = 0
    
    for name, test_func in tests:
        try:
            result = test_func()
            if result:
                passed += 1
            else:
                failed += 1
        except Exception as e:
            print(f"  {Colors.RED}[FAIL] Test '{name}' raised exception: {e}{Colors.RESET}")
            failed += 1
    
    # Summary
    print(f"\n{Colors.CYAN}========================================")
    print("         TEST SUMMARY")
    print("========================================")
    print(f"  Tests Run:     {len(tests):3d}")
    print(f"  Tests Passed:   {passed:3d}")
    print(f"  Tests Failed:   {failed:3d}")
    print(f"========================================{Colors.RESET}")
    print()
    
    if failed == 0:
        print(f"{Colors.GREEN}[OK] ALL TESTS PASSED{Colors.RESET}")
        print()
        print("The Mesh Holds.")
        return 0
    else:
        print(f"{Colors.RED}[FAIL] SOME TESTS FAILED{Colors.RESET}")
        return 1

if __name__ == "__main__":
    sys.exit(main())
