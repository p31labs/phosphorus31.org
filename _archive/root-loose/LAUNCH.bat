@echo off
:: Phenix Protocol - One-Click Launch Script for Windows
:: Sovereign Stack Deployment

title Phenix Protocol Launcher
color 0D

echo.
echo   [95m=========================================[0m
echo   [95m   PHENIX PROTOCOL - SOVEREIGN STACK[0m
echo   [95m=========================================[0m
echo.
echo   A Geodesic Engine for the Post-Wye Era
echo   Mark 1 Attractor: H = 0.35
echo.

:: Check if Node.js is available
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [91m[ERROR] Node.js not found. Please install from nodejs.org[0m
    pause
    exit /b 1
)

:: Check if npm packages are installed
if not exist "dashboard\node_modules" (
    echo [93m[INFO] Installing dashboard dependencies...[0m
    cd dashboard
    call npm install
    cd ..
)

:: Start the dashboard
echo.
echo [92m[INFO] Starting Geodesic Engine Dashboard...[0m
echo.
echo   Dashboard URL: [96mhttp://localhost:5173[0m
echo   Press Ctrl+C to stop
echo.
echo   [95m=========================================[0m
echo   [95m      The Dome is now active.[0m
echo   [95m   "Protect the dome, protect the self."[0m
echo   [95m=========================================[0m
echo.

cd dashboard
call npm run dev

pause
