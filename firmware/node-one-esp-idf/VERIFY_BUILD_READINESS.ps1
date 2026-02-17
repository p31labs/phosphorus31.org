# Node One - Build Readiness Verification
# Pre-build checks to catch issues before compilation

Write-Host "P31 NODE ONE - BUILD READINESS VERIFICATION" -ForegroundColor Cyan
Write-Host ""

$errors = @()
$warnings = @()

# ============================================================================
# 1. File Existence Checks
# ============================================================================
Write-Host "Checking required files..." -ForegroundColor Yellow

$requiredFiles = @{
    "CMakeLists.txt" = "Root CMakeLists"
    "sdkconfig.defaults" = "SDK configuration"
    "main\CMakeLists.txt" = "Main component CMakeLists"
    "main\main.cpp" = "Main application"
    "main\pin_map.h" = "Pin map (Agent 1)"
    "main\pin_config.h" = "Pin configuration"
    "main\node_one_config.h" = "Device configuration"
    "components\bsp\bsp.c" = "Board Support Package"
    "components\bsp\include\bsp.h" = "BSP header"
    "components\audio_engine\audio_engine.c" = "Audio engine"
    "components\audio_engine\include\audio_engine.h" = "Audio engine header"
    "components\lora_radio\lora_radio.cpp" = "LoRa radio driver"
    "components\lora_radio\include\lora_radio.h" = "LoRa radio header"
    "components\button_input\button_input.c" = "Button input"
    "components\button_input\include\button_input.h" = "Button input header"
    "components\display\display.c" = "Display component"
    "components\display\include\display.h" = "Display header"
    "components\shield_server\shield_server.c" = "Shield server"
    "components\shield_server\include\shield_server.h" = "Shield server header"
}

foreach ($file in $requiredFiles.Keys) {
    if (Test-Path $file) {
        Write-Host "   [OK] $($requiredFiles[$file])" -ForegroundColor Green
    } else {
        Write-Host "   [FAIL] Missing: $($requiredFiles[$file])" -ForegroundColor Red
        $errors += "Missing file: $file"
    }
}

Write-Host ""

# ============================================================================
# 2. Pin Definition Consistency
# ============================================================================
Write-Host "Checking pin definition consistency..." -ForegroundColor Yellow

$pinMapFile = "main\pin_map.h"
$pinConfigFile = "main\pin_config.h"

if (Test-Path $pinMapFile) {
    $pinMapContent = Get-Content $pinMapFile -Raw
    
    # Check LoRa pins
    $loraPins = @("PIN_LORA_SCK", "PIN_LORA_MOSI", "PIN_LORA_MISO", "PIN_LORA_NSS", 
                  "PIN_LORA_BUSY", "PIN_LORA_DIO1", "PIN_LORA_NRST", 
                  "PIN_LORA_TXEN", "PIN_LORA_RXEN")
    
    foreach ($pin in $loraPins) {
        if ($pinMapContent -match $pin) {
            Write-Host "   [OK] $pin defined in pin_map.h" -ForegroundColor Green
        } else {
            Write-Host "   [WARN] $pin not found in pin_map.h" -ForegroundColor Yellow
            $warnings += "$pin not in pin_map.h"
        }
    }
    
    # Check I2S pins
    $i2sPins = @("I2S_MCLK", "I2S_BCLK", "I2S_LRCK", "I2S_DOUT", "I2S_DIN")
    foreach ($pin in $i2sPins) {
        if ($pinMapContent -match $pin) {
            Write-Host "   [OK] $pin defined in pin_map.h" -ForegroundColor Green
        } else {
            Write-Host "   [WARN] $pin not found in pin_map.h" -ForegroundColor Yellow
            $warnings += "$pin not in pin_map.h"
        }
    }
    
    # Check QSPI display pins
    $qspiPins = @("LCD_QSPI_CS", "LCD_QSPI_CLK", "LCD_QSPI_D0", "LCD_QSPI_D1", 
                  "LCD_QSPI_D2", "LCD_QSPI_D3", "LCD_BL")
    foreach ($pin in $qspiPins) {
        if ($pinMapContent -match $pin) {
            Write-Host "   [OK] $pin defined in pin_map.h" -ForegroundColor Green
        } else {
            Write-Host "   [WARN] $pin not found in pin_map.h" -ForegroundColor Yellow
            $warnings += "$pin not in pin_map.h"
        }
    }
} else {
    Write-Host "   [FAIL] pin_map.h not found" -ForegroundColor Red
    $errors += "pin_map.h missing"
}

Write-Host ""

# ============================================================================
# 3. Include Path Checks
# ============================================================================
Write-Host "Checking include paths..." -ForegroundColor Yellow

$sourceFiles = @(
    "components\audio_engine\audio_engine.c",
    "components\lora_radio\lora_radio.cpp",
    "components\button_input\button_input.c",
    "components\display\display.c"
)

foreach ($file in $sourceFiles) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        
        # Check for pin_map.h or pin_config.h include
        if ($content -match '#include\s+["<]pin_map\.h[">]' -or 
            $content -match '#include\s+["<]pin_config\.h[">]') {
            Write-Host "   [OK] $file includes pin definitions" -ForegroundColor Green
        } else {
            Write-Host "   [WARN] $file may be missing pin includes" -ForegroundColor Yellow
            $warnings += "$file missing pin includes"
        }
    }
}

Write-Host ""

# ============================================================================
# 4. Component Dependencies
# ============================================================================
Write-Host "Checking component dependencies..." -ForegroundColor Yellow

$componentManifests = @(
    "main\idf_component.yml",
    "components\bsp\idf_component.yml",
    "components\audio_engine\idf_component.yml",
    "components\lora_radio\idf_component.yml",
    "components\display\idf_component.yml"
)

foreach ($manifest in $componentManifests) {
    if (Test-Path $manifest) {
        Write-Host "   [OK] $(Split-Path $manifest -Leaf)" -ForegroundColor Green
    } else {
        Write-Host "   [WARN] Missing: $manifest" -ForegroundColor Yellow
        $warnings += "Missing manifest: $manifest"
    }
}

Write-Host ""

# ============================================================================
# 5. Configuration Checks
# ============================================================================
Write-Host "Checking configuration files..." -ForegroundColor Yellow

if (Test-Path "sdkconfig.defaults") {
    $sdkConfig = Get-Content "sdkconfig.defaults" -Raw
    
    $requiredConfigs = @(
        "CONFIG_IDF_TARGET=`"esp32s3`"",
        "CONFIG_SPIRAM=y",
        "CONFIG_PARTITION_TABLE_CUSTOM=y"
    )
    
    foreach ($config in $requiredConfigs) {
        if ($sdkConfig -match [regex]::Escape($config)) {
            Write-Host "   [OK] $config" -ForegroundColor Green
        } else {
            Write-Host "   [WARN] Missing: $config" -ForegroundColor Yellow
            $warnings += "Missing config: $config"
        }
    }
} else {
    Write-Host "   [FAIL] sdkconfig.defaults not found" -ForegroundColor Red
    $errors += "sdkconfig.defaults missing"
}

Write-Host ""

# ============================================================================
# 6. ESP-IDF Environment Check
# ============================================================================
Write-Host "Checking ESP-IDF environment..." -ForegroundColor Yellow

if (Get-Command idf.py -ErrorAction SilentlyContinue) {
    Write-Host "   [OK] ESP-IDF found in PATH" -ForegroundColor Green
    $version = idf.py --version 2>&1
    Write-Host "   Version: $version" -ForegroundColor Gray
    
    # Check version (should be 5.4+)
    if ($version -match "v5\.[4-9]") {
        Write-Host "   [OK] Version 5.4+ detected" -ForegroundColor Green
    } elseif ($version -match "v5\.\d{2}") {
        Write-Host "   [OK] Version 5.4+ detected" -ForegroundColor Green
    } else {
        Write-Host "   [WARN] Version may be too old (need 5.4+)" -ForegroundColor Yellow
        $warnings += "ESP-IDF version may be too old"
    }
} else {
    Write-Host "   [WARN] ESP-IDF not in PATH" -ForegroundColor Yellow
    Write-Host '      Run: . $env:USERPROFILE\esp\esp-idf\export.ps1' -ForegroundColor Gray
    $warnings += "ESP-IDF not in PATH"
}

Write-Host ""

# ============================================================================
# SUMMARY
# ============================================================================
Write-Host "════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "VERIFICATION SUMMARY" -ForegroundColor Cyan
Write-Host "════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

if ($errors.Count -eq 0 -and $warnings.Count -eq 0) {
    Write-Host "[OK] ALL CHECKS PASSED" -ForegroundColor Green
    Write-Host "   Ready to build!" -ForegroundColor Green
    Write-Host ""
    Write-Host "   Next step: .\BUILD_AND_TEST.ps1" -ForegroundColor Cyan
    exit 0
} elseif ($errors.Count -eq 0) {
    Write-Host "[WARN] BUILD READY WITH WARNINGS" -ForegroundColor Yellow
    Write-Host "   Warnings: $($warnings.Count)" -ForegroundColor Yellow
    Write-Host ""
    foreach ($warning in $warnings) {
        Write-Host "   - $warning" -ForegroundColor Gray
    }
    Write-Host ""
    Write-Host "   Can proceed with build, but review warnings" -ForegroundColor Yellow
    exit 0
} else {
    Write-Host "[FAIL] BUILD NOT READY" -ForegroundColor Red
    Write-Host "   Errors: $($errors.Count)" -ForegroundColor Red
    Write-Host "   Warnings: $($warnings.Count)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   ERRORS (must fix):" -ForegroundColor Red
    foreach ($error in $errors) {
        Write-Host "   - $error" -ForegroundColor Red
    }
    if ($warnings.Count -gt 0) {
        Write-Host ""
        Write-Host "   WARNINGS (should fix):" -ForegroundColor Yellow
        foreach ($warning in $warnings) {
            Write-Host "   - $warning" -ForegroundColor Gray
        }
    }
    Write-Host ""
    exit 1
}

Write-Host ""
Write-Host "The Mesh Holds." -ForegroundColor Cyan
