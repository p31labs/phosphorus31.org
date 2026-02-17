@echo off
:: SUPER CENTAUR - 1-Click Deploy Script
:: 🦄 The Ultimate Legal & Autonomous Agent System
:: 💜 With love and light - As above, so below

echo.
echo 🚀 SUPER CENTAUR - 1-Click Deployment
echo 🦄 The Ultimate Legal & Autonomous Agent System
echo 💜 With love and light - As above, so below
echo.

:: Check if running as administrator
net session >nul 2>&1
if %errorLevel% NEQ 0 (
    echo ❌ This script requires administrator privileges.
    echo 💜 Please run as administrator and try again.
    pause
    exit /b 1
)

:: Set variables
set "PROJECT_DIR=%~dp0.."
set "LOG_FILE=%PROJECT_DIR%\deployment\deploy.log"
set "NODE_VERSION=18.0.0"
set "PORT=3002"

:: Create log directory
if not exist "%PROJECT_DIR%\deployment" mkdir "%PROJECT_DIR%\deployment"

:: Function to log messages
:log
echo [%DATE% %TIME%] %~1 >> "%LOG_FILE%"
echo %~1
goto :eof

:: Function to check if command exists
:check_command
where %~1 >nul 2>&1
if %errorlevel% equ 0 (
    call :log "✅ %~1 is installed"
    exit /b 0
) else (
    call :log "❌ %~1 is NOT installed"
    exit /b 1
)

:: Function to install Node.js
:install_node
call :log "📦 Installing Node.js..."
powershell -Command "Invoke-WebRequest -Uri 'https://nodejs.org/dist/v%NODE_VERSION%/node-v%NODE_VERSION%-x64.msi' -OutFile '%TEMP%\node.msi'"
msiexec /i "%TEMP%\node.msi" /quiet
del "%TEMP%\node.msi"
goto :eof

:: Function to install dependencies
:install_dependencies
call :log "📦 Installing dependencies..."
cd /d "%PROJECT_DIR%"
call npm install --loglevel=error
if %errorlevel% equ 0 (
    call :log "✅ Dependencies installed successfully"
) else (
    call :log "❌ Failed to install dependencies"
    exit /b 1
)
goto :eof

:: Function to build project
:build_project
call :log "🔨 Building project..."
call npm run build
if %errorlevel% equ 0 (
    call :log "✅ Project built successfully"
) else (
    call :log "❌ Failed to build project"
    exit /b 1
)
goto :eof

:: Function to create Windows service
:create_service
call :log "🔧 Creating Windows service..."
if exist "%WINDIR%\System32\sc.exe" (
    sc query SUPER_CENTAUR >nul 2>&1
    if %errorlevel% equ 0 (
        call :log "⚠️  SUPER_CENTAUR service already exists"
        sc stop SUPER_CENTAUR >nul 2>&1
        sc delete SUPER_CENTAUR >nul 2>&1
        call :log "🗑️  Removed existing service"
    )
    
    sc create SUPER_CENTAUR binPath= "%PROJECT_DIR%\node_modules\.bin\npm.cmd run start -- --port %PORT%" start= auto
    sc description SUPER_CENTAUR "SUPER CENTAUR - The Ultimate Legal & Autonomous Agent System"
    
    if %errorlevel% equ 0 (
        call :log "✅ Windows service created successfully"
    ) else (
        call :log "❌ Failed to create Windows service"
        exit /b 1
    )
) else (
    call :log "⚠️  Windows service creation not supported on this system"
)
goto :eof

:: Function to start service
:start_service
call :log "🚀 Starting SUPER CENTAUR service..."
sc start SUPER_CENTAUR >nul 2>&1
if %errorlevel% equ 0 (
    call :log "✅ Service started successfully"
) else (
    call :log "⚠️  Failed to start service (this is normal on some systems)"
)
goto :eof

:: Function to create desktop shortcut
:create_shortcut
call :log "🔗 Creating desktop shortcuts..."
set "DESKTOP=%USERPROFILE%\Desktop"

:: Create main application shortcut
echo Set oWS = WScript.CreateObject("WScript.Shell") > "%TEMP%\create_shortcut.vbs"
echo sLinkFile = "%DESKTOP%\SUPER CENTAUR.lnk" >> "%TEMP%\create_shortcut.vbs"
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> "%TEMP%\create_shortcut.vbs"
echo oLink.TargetPath = "%PROJECT_DIR%\deployment\start-server.bat" >> "%TEMP%\create_shortcut.vbs"
echo oLink.IconLocation = "%PROJECT_DIR%\deployment\icons\centaur.ico" >> "%TEMP%\create_shortcut.vbs"
echo oLink.Description = "SUPER CENTAUR - The Ultimate Legal & Autonomous Agent System" >> "%TEMP%\create_shortcut.vbs"
echo oLink.WorkingDirectory = "%PROJECT_DIR%" >> "%TEMP%\create_shortcut.vbs"
echo oLink.Save >> "%TEMP%\create_shortcut.vbs"
cscript "%TEMP%\create_shortcut.vbs"
del "%TEMP%\create_shortcut.vbs"

:: Create CLI shortcut
echo Set oWS = WScript.CreateObject("WScript.Shell") > "%TEMP%\create_cli_shortcut.vbs"
echo sLinkFile = "%DESKTOP%\SUPER CENTAUR CLI.lnk" >> "%TEMP%\create_cli_shortcut.vbs"
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> "%TEMP%\create_cli_shortcut.vbs"
echo oLink.TargetPath = "%PROJECT_DIR%\deployment\open-cli.bat" >> "%TEMP%\create_cli_shortcut.vbs"
echo oLink.IconLocation = "%PROJECT_DIR%\deployment\icons\terminal.ico" >> "%TEMP%\create_cli_shortcut.vbs"
echo oLink.Description = "SUPER CENTAUR CLI - Command Line Interface" >> "%TEMP%\create_cli_shortcut.vbs"
echo oLink.WorkingDirectory = "%PROJECT_DIR%" >> "%TEMP%\create_cli_shortcut.vbs"
echo oLink.Save >> "%TEMP%\create_cli_shortcut.vbs"
cscript "%TEMP%\create_cli_shortcut.vbs"
del "%TEMP%\create_cli_shortcut.vbs"

call :log "✅ Desktop shortcuts created"
goto :eof

:: Function to create start script
:create_start_script
call :log "📝 Creating start script..."
(
    echo @echo off
    echo :: SUPER CENTAUR Start Script
    echo echo 🚀 Starting SUPER CENTAUR...
    echo cd /d "%PROJECT_DIR%"
    echo npm run cli -- start --port %PORT%
    echo pause
) > "%PROJECT_DIR%\deployment\start-server.bat"
goto :eof

:: Function to create CLI script
:create_cli_script
call :log "📝 Creating CLI script..."
(
    echo @echo off
    echo :: SUPER CENTAUR CLI Script
    echo echo 💻 Opening SUPER CENTAUR CLI...
    echo cd /d "%PROJECT_DIR%"
    echo npm run cli
    echo pause
) > "%PROJECT_DIR%\deployment\open-cli.bat"
goto :eof

:: Function to create uninstall script
:create_uninstall_script
call :log "📝 Creating uninstall script..."
(
    echo @echo off
    echo :: SUPER CENTAUR Uninstall Script
    echo echo 🗑️  Uninstalling SUPER CENTAUR...
    echo sc stop SUPER_CENTAUR ^>nul 2^>^&1
    echo sc delete SUPER_CENTAUR ^>nul 2^>^&1
    echo echo ✅ Service removed
    echo echo 💜 SUPER CENTAUR has been uninstalled
    echo pause
) > "%PROJECT_DIR%\deployment\uninstall.bat"
goto :eof

:: Function to create icons directory
:create_icons
call :log "🎨 Creating icons directory..."
if not exist "%PROJECT_DIR%\deployment\icons" mkdir "%PROJECT_DIR%\deployment\icons"
goto :eof

:: Function to create configuration
:create_config
call :log "⚙️  Creating configuration..."
if not exist "%PROJECT_DIR%\config" mkdir "%PROJECT_DIR%\config"
if not exist "%PROJECT_DIR%\config\super-centaur.config.json" (
    (
        echo {
        echo   "server": {
        echo     "port": %PORT%,
        echo     "host": "localhost",
        echo     "cors": {
        echo       "origin": "*",
        echo       "credentials": true
        echo     },
        echo     "rateLimit": {
        echo       "windowMs": 900000,
        echo       "max": 100
        echo     }
        echo   },
        echo   "database": {
        echo     "type": "sqlite",
        echo     "path": "./data/super-centaur.db"
        echo   },
        echo   "ai": {
        echo     "provider": "openai",
        echo     "model": "gpt-4",
        echo     "apiKey": ""
        echo   },
        echo   "legal": {
        echo     "jurisdiction": "US",
        echo     "documentTypes": ["contract", "motion", "complaint", "agreement"],
        echo     "emergencyResponse": true
        echo   },
        echo   "medical": {
        echo     "enableDocumentation": true,
        echo     "enableExpertWitness": true,
        echo     "conditions": ["hypoparathyroidism", "intellectual-gaps", "generational-trauma"]
        echo   },
        echo   "blockchain": {
        echo     "provider": "infura",
        echo     "network": "testnet",
        echo     "wallet": {
        echo       "privateKey": "",
        echo       "mnemonic": ""
        echo     },
        echo     "contracts": {
        echo       "legalFramework": "",
        echo       "identity": "",
        echo       "governance": ""
        echo     }
        echo   },
        echo   "frontend": {
        echo     "buildDir": "./dist",
        echo     "port": 3003
        echo   }
        echo }
    ) > "%PROJECT_DIR%\config\super-centaur.config.json"
)
call :log "✅ Configuration created"
goto :eof

:: Function to display success message
:show_success
echo.
echo 🎉 SUPER CENTAUR Deployment Complete!
echo.
echo 📍 Server will be available at: http://localhost:%PORT%
echo 📍 Frontend will be available at: http://localhost:3003
echo.
echo 💻 Use the desktop shortcuts to:
echo   • Start SUPER CENTAUR server
echo   • Open SUPER CENTAUR CLI
echo.
echo 🗑️  To uninstall, run: %PROJECT_DIR%\deployment\uninstall.bat
echo.
echo 💜 With love and light - As above, so below
echo.
pause
goto :eof

:: Main deployment process
call :log "🚀 Starting SUPER CENTAUR deployment..."

:: Check prerequisites
call :check_command node
if %errorlevel% equ 1 call :install_node

call :check_command npm
if %errorlevel% equ 1 (
    call :log "❌ npm is required but not found"
    exit /b 1
)

:: Create necessary directories and files
call :create_icons
call :create_config
call :create_start_script
call :create_cli_script
call :create_uninstall_script

:: Install and build
call :install_dependencies
call :build_project

:: Setup service and shortcuts
call :create_service
call :start_service
call :create_shortcut

:: Show success message
call :show_success

exit /b 0