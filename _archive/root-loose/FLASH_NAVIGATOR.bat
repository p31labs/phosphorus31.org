@echo off
REM ============================================================
REM 🔺 PHENIX NAVIGATOR FLASH LAUNCHER
REM    Cognitive Shield Firmware Deployment v1.0
REM ============================================================
setlocal enabledelayedexpansion

echo.
echo ============================================================
echo    🔺 PHENIX NAVIGATOR - FIRMWARE FLASH LAUNCHER
echo ============================================================
echo.

REM Check for ESP-IDF
where idf.py >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] ESP-IDF not found in PATH!
    echo.
    echo Please install ESP-IDF v5.1+ and run the export script:
    echo   - Download: https://dl.espressif.com/dl/esp-idf/
    echo   - After install, run: %%IDF_PATH%%\export.bat
    echo.
    pause
    exit /b 1
)

echo [✓] ESP-IDF detected
echo.

REM Check COM ports
echo Available COM ports:
echo -------------------
for /f "tokens=*" %%i in ('mode ^| findstr "COM"') do echo   %%i

echo.
set /p COMPORT="Enter COM port (e.g., COM5): "

if "%COMPORT%"=="" (
    echo [ERROR] No COM port specified!
    pause
    exit /b 1
)

echo.
echo ============================================================
echo    FLASH CONFIGURATION
echo ============================================================
echo    Target:      Waveshare ESP32-S3-Touch-LCD-3.5B Type B
echo    Port:        %COMPORT%
echo    Firmware:    Phenix Phantom v4.0
echo ============================================================
echo.

set /p CONFIRM="Ready to flash? (y/N): "
if /i not "%CONFIRM%"=="y" (
    echo Flash cancelled.
    pause
    exit /b 0
)

echo.
echo [1/5] Navigating to firmware directory...
cd /d "%~dp0phenix_phantom"
if %errorlevel% neq 0 (
    echo [ERROR] phenix_phantom directory not found!
    pause
    exit /b 1
)

echo [2/5] Setting ESP32-S3 target...
call idf.py set-target esp32s3
if %errorlevel% neq 0 (
    echo [ERROR] Failed to set target!
    pause
    exit /b 1
)

echo [3/5] Copying hardware calibration (Type B)...
if exist sdkconfig.defaults (
    copy /y sdkconfig.defaults sdkconfig >nul
    echo [✓] sdkconfig.defaults applied
) else (
    echo [WARN] sdkconfig.defaults not found, using existing config
)

echo [4/5] Building firmware...
call idf.py build
if %errorlevel% neq 0 (
    echo [ERROR] Build failed! Check errors above.
    pause
    exit /b 1
)

echo.
echo ============================================================
echo   READY TO FLASH
echo ============================================================
echo.
echo   1. Connect Navigator via USB-C to "USB" port (NOT UART)
echo   2. Ensure device is powered (5V/1A minimum)
echo   3. Hold BOOT button while pressing RST if needed
echo.
pause

echo [5/5] Flashing to %COMPORT%...
call idf.py -p %COMPORT% flash monitor

echo.
echo ============================================================
echo   🔺 FLASH COMPLETE
echo ============================================================
echo.
echo Expected serial output indicators:
echo   - PMIC: Energizing display rails (ALDO1: 3.3V)
echo   - QSPI: AXS15231B Handshake Verified
echo   - NEURAL SHIELD: Fisher Firewall Active on Core 1
echo   - SPROUT: C-Invariant: 1.000 [ISOSTATIC]
echo.
echo Visual indicators:
echo   - Screen clears from static to black
echo   - Backlight activates
echo   - Tetrahedron Sprout logo appears (Cyan #00f2ff)
echo.
echo Press any key to exit...
pause >nul
