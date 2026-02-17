@echo off
echo 🎮 Starting Constructor's Challenge Game Engine...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed or not in PATH
    echo Please install npm with Node.js
    pause
    exit /b 1
)

REM Navigate to project root
cd /d "%~dp0"

echo 📦 Installing dependencies...
call npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully

echo 🎨 Building frontend...
cd frontend
call npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    cd ..
    pause
    exit /b 1
)

cd ..

echo 🚀 Starting game development server...
echo 💡 Game will be available at: http://localhost:5173
echo 💡 Use keyboard shortcuts: 1-5 (pieces), W/M/C/Q (materials), +/- (scale), G (grid), V (snap), T (test)
echo.

REM Start the frontend development server
cd frontend
npm run dev

echo.
echo 🎮 Game server stopped
pause