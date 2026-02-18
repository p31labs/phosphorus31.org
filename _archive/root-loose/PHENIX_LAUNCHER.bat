@echo off
:: ╔═══════════════════════════════════════════════════════════════════════════════╗
:: ║                                                                               ║
:: ║                    🔺 PHENIX PROTOCOL - UNIFIED LAUNCHER 🔺                   ║
:: ║                                                                               ║
:: ║                   "The Mesh Holds. Protect Ya Neck." 💜                       ║
:: ║                                                                               ║
:: ╚═══════════════════════════════════════════════════════════════════════════════╝

title Phenix Protocol Launcher

echo.
echo     🔺 PHENIX PROTOCOL 🔺
echo     ═══════════════════════════════════════════
echo.
echo     What would you like to launch?
echo.
echo     [1] 🏠 Phenix Control Tower (Main Dashboard)
echo     [2] 🌱 Wonky Sprout (Kids Command Center)
echo     [3] 👨‍👩‍👧‍👦 Family Hub (Parent Dashboard)
echo     [4] 🐳 Full Citadel Stack (Docker)
echo     [5] 🔥 Live Fire Protocol (Stress Test)
echo     [6] 📊 Monitoring (Prometheus/Grafana)
echo     [7] 🚨 Emergency Abdication Check
echo     [8] 📦 Build Release Package
echo     [9] ❌ Exit
echo.
echo     ═══════════════════════════════════════════

set /p choice="Enter choice [1-9]: "

if "%choice%"=="1" goto dashboard
if "%choice%"=="2" goto wonky
if "%choice%"=="3" goto family
if "%choice%"=="4" goto citadel
if "%choice%"=="5" goto livefire
if "%choice%"=="6" goto monitoring
if "%choice%"=="7" goto abdication
if "%choice%"=="8" goto build
if "%choice%"=="9" goto exit

echo Invalid choice. Please try again.
pause
goto :eof

:dashboard
echo.
echo 🏠 Starting Phenix Control Tower...
cd dashboard
start cmd /k "npm run dev"
echo Dashboard starting at http://localhost:5173
pause
goto :eof

:wonky
echo.
echo 🌱 Starting Wonky Sprout Kids Zone...
cd wonky-sprout
if not exist node_modules (
    echo Installing dependencies first...
    call npm install
)
start cmd /k "npm run dev"
echo Wonky Sprout starting at http://localhost:5174
echo.
echo 💜 PROTECT YA NECK! Have fun creating! 💜
pause
goto :eof

:family
echo.
echo 👨‍👩‍👧‍👦 Family Hub is integrated into Wonky Sprout
echo.
echo Navigate to: http://localhost:5174/family
echo Or open Wonky Sprout and access Family Hub from there
pause
goto :eof

:citadel
echo.
echo 🐳 Starting Full Citadel Stack...
echo This will start: PostgreSQL, Redis, Backend, Dashboard
echo.
docker-compose up -d
echo.
echo Services starting:
echo   - PostgreSQL: localhost:5432
echo   - Redis: localhost:6379
echo   - Backend: localhost:8000
echo   - Dashboard: localhost:5173
pause
goto :eof

:livefire
echo.
echo 🔥 LIVE FIRE PROTOCOL
echo ═══════════════════════════════════════════
echo.
echo This will run comprehensive stress tests.
echo Are you sure? (Y/N)
set /p confirm="Confirm: "
if /i "%confirm%"=="Y" (
    python stress_test.py
)
pause
goto :eof

:monitoring
echo.
echo 📊 Starting Monitoring Stack...
docker-compose -f docker-compose.monitoring.yml up -d
echo.
echo Monitoring available at:
echo   - Prometheus: http://localhost:9090
echo   - Grafana: http://localhost:3000 (admin/admin)
pause
goto :eof

:abdication
echo.
echo 🚨 EMERGENCY ABDICATION STATUS CHECK
echo ═══════════════════════════════════════════
echo.
python check_system.py
echo.
echo ═══════════════════════════════════════════
echo Kenosis Date: February 14, 2026
echo Days Remaining: (calculated at runtime)
echo.
echo Review abdicate.sh for succession protocol.
pause
goto :eof

:build
echo.
echo 📦 Building Release Package...
python package_build.py
echo.
echo Release package created in release_final/
pause
goto :eof

:exit
echo.
echo 💜 The Mesh Holds. Stay sovereign. 🔺
echo.
exit /b 0
