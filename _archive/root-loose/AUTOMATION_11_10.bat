@echo off
echo.
echo ╔══════════════════════════════════════════════════════════════════╗
echo ║                 AUTOMATION TO 11/10 - LAUNCHER                   ║
echo ║                SOVEREIGN SYSTEM COMPLETE OVERHAUL                ║
echo ╚══════════════════════════════════════════════════════════════════╝
echo.

REM Check if we're in the right directory
if not exist "dashboard" (
    echo ❌ ERROR: Not in Sovereign workspace directory
    echo Please run this from c:\MASTER_PROJECT\67
    pause
    exit /b 1
)

REM Set up logging directory
if not exist "automation_logs" mkdir automation_logs
set LOGFILE=automation_logs\launch_%DATE:~10,4%%DATE:~4,2%%DATE:~7,2%_%TIME:~0,2%%TIME:~3,2%.log

echo 📅 Launch started: %DATE% %TIME% > "%LOGFILE%"

:MAIN_MENU
cls
echo.
echo ╔══════════════════════════════════════════════════════════════════╗
echo ║                     AUTOMATION TO 11/10                          ║
echo ╠══════════════════════════════════════════════════════════════════╣
echo ║                                                                  ║
echo ║  1. 🚀 DEPLOY EVERYTHING - Full system deployment               ║
echo ║  2. 👁️  MONITOR SYSTEM - Continuous health monitoring          ║
echo ║  3. 🏥 HEALTH CHECK - Quick system status                       ║
echo ║  4. 🔄 AUTO-HEAL - Fix broken components                        ║
echo ║  5. 🔍 DISCOVER SYSTEM - Map all components                     ║
echo ║  6. 🔮 PREDICTIVE MAINTENANCE - Anticipate failures             ║
echo ║  7. 📚 HEAL DOCUMENTATION - Update all docs                     ║
echo ║  8. 🧪 RUN TESTS - Verify everything works                      ║
echo ║  9. ⚙️  ADVANCED OPTIONS                                        ║
echo ║  0. ❌ EXIT                                                      ║
echo ║                                                                  ║
echo ╚══════════════════════════════════════════════════════════════════╝
echo.
set /p choice="Enter choice (0-9): "

if "%choice%"=="1" goto DEPLOY_ALL
if "%choice%"=="2" goto MONITOR
if "%choice%"=="3" goto HEALTH_CHECK
if "%choice%"=="4" goto AUTO_HEAL
if "%choice%"=="5" goto DISCOVER
if "%choice%"=="6" goto PREDICTIVE
if "%choice%"=="7" goto HEAL_DOCS
if "%choice%"=="8" goto RUN_TESTS
if "%choice%"=="9" goto ADVANCED
if "%choice%"=="0" goto EXIT

echo Invalid choice. Press any key to try again.
pause >nul
goto MAIN_MENU

:DEPLOY_ALL
echo.
echo 🚀 DEPLOYING ENTIRE SOVEREIGN SYSTEM...
echo.
echo Starting full deployment at %TIME% >> "%LOGFILE%"
python scripts/sovereign_orchestrator.py deploy >> "%LOGFILE%" 2>&1

if %ERRORLEVEL% EQU 0 (
    echo ✅ Deployment successful!
    echo ✅ Deployment successful at %TIME% >> "%LOGFILE%"
) else (
    echo ❌ Deployment failed. Check %LOGFILE% for details.
    echo ❌ Deployment failed at %TIME% >> "%LOGFILE%"
)

echo.
echo 📋 Launching dashboard and backend...
start powershell -NoExit -Command "cd dashboard; npm run dev"
timeout /t 3 /nobreak >nul
start powershell -NoExit -Command "cd backend; python backend_core.py"
timeout /t 3 /nobreak >nul

echo.
echo 🌐 Access points:
echo    Dashboard: http://localhost:5173
echo    Backend API: http://localhost:8000
echo    Grafana: http://localhost:3000 (admin/admin)
echo.
echo 💜 THE MESH HOLDS. System deployed.
echo.
pause
goto MAIN_MENU

:MONITOR
echo.
echo 👁️  STARTING CONTINUOUS MONITORING...
echo.
echo Starting monitoring at %TIME% >> "%LOGFILE%"
echo Press Ctrl+C to stop monitoring.
echo.
python scripts/sovereign_orchestrator.py monitor
echo Monitoring stopped at %TIME% >> "%LOGFILE%"
pause
goto MAIN_MENU

:HEALTH_CHECK
echo.
echo 🏥 RUNNING SYSTEM HEALTH CHECK...
echo.
echo Health check at %TIME% >> "%LOGFILE%"
python scripts/sovereign_orchestrator.py health
echo Health check completed at %TIME% >> "%LOGFILE%"
pause
goto MAIN_MENU

:AUTO_HEAL
echo.
echo 🔄 AUTO-HEALING BROKEN COMPONENTS...
echo.
echo Auto-heal started at %TIME% >> "%LOGFILE%"
python scripts/sovereign_orchestrator.py heal
echo Auto-heal completed at %TIME% >> "%LOGFILE%"
pause
goto MAIN_MENU

:DISCOVER
echo.
echo 🔍 DISCOVERING SYSTEM COMPONENTS...
echo.
echo Discovery started at %TIME% >> "%LOGFILE%"
python scripts/auto_discovery.py --report
echo Discovery completed at %TIME% >> "%LOGFILE%"
pause
goto MAIN_MENU

:PREDICTIVE
echo.
echo 🔮 RUNNING PREDICTIVE MAINTENANCE...
echo.
echo Predictive maintenance started at %TIME% >> "%LOGFILE%"
python scripts/predictive_maintenance.py --run --report
echo Predictive maintenance completed at %TIME% >> "%LOGFILE%"
pause
goto MAIN_MENU

:HEAL_DOCS
echo.
echo 📚 HEALING DOCUMENTATION...
echo.
echo Documentation healing started at %TIME% >> "%LOGFILE%"
python scripts/self_healing_docs.py --heal
echo Documentation healing completed at %TIME% >> "%LOGFILE%"
pause
goto MAIN_MENU

:RUN_TESTS
echo.
echo 🧪 RUNNING SYSTEM TESTS...
echo.
echo System tests started at %TIME% >> "%LOGFILE%"

echo 1. Running deployment verification...
python scripts/verify_deployment.py >> "%LOGFILE%" 2>&1
if %ERRORLEVEL% EQU 0 (echo   ✅ Deployment verification passed) else (echo   ❌ Deployment verification failed)

echo 2. Running sovereignty verification...
python scripts/verify_sovereignty.py >> "%LOGFILE%" 2>&1
if %ERRORLEVEL% EQU 0 (echo   ✅ Sovereignty verification passed) else (echo   ❌ Sovereignty verification failed)

echo 3. Running full system test...
python FULL_SYSTEM_TEST.py >> "%LOGFILE%" 2>&1
if %ERRORLEVEL% EQU 0 (echo   ✅ Full system test passed) else (echo   ❌ Full system test failed)

echo 4. Running isostatic tests...
python run_isostatic_tests.py >> "%LOGFILE%" 2>&1
if %ERRORLEVEL% EQU 0 (echo   ✅ Isostatic tests passed) else (echo   ❌ Isostatic tests failed)

echo.
echo 📊 All tests completed. Check %LOGFILE% for details.
echo System tests completed at %TIME% >> "%LOGFILE%"
pause
goto MAIN_MENU

:ADVANCED
cls
echo.
echo ╔══════════════════════════════════════════════════════════════════╗
echo ║                     ADVANCED OPTIONS                             ║
echo ╠══════════════════════════════════════════════════════════════════╣
echo ║                                                                  ║
echo ║  A. 📊 START MONITORING STACK (Prometheus/Grafana)              ║
echo ║  B. 🗄️  START DATABASE SERVICES (PostgreSQL/Redis)              ║
echo ║  C. 🎨 START WONKY SPROUT (Kids Zone)                           ║
echo ║  D. 🔧 RUN SOVEREIGN SETUP SCRIPT                               ║
echo ║  E. 📁 VIEW LOGS                                                ║
echo ║  F. 🔙 BACK TO MAIN MENU                                        ║
echo ║                                                                  ║
echo ╚══════════════════════════════════════════════════════════════════╝
echo.
set /p advanced_choice="Enter choice (A-F): "

if /i "%advanced_choice%"=="A" goto START_MONITORING
if /i "%advanced_choice%"=="B" goto START_DATABASE
if /i "%advanced_choice%"=="C" goto START_WONKY
if /i "%advanced_choice%"=="D" goto RUN_SETUP
if /i "%advanced_choice%"=="E" goto VIEW_LOGS
if /i "%advanced_choice%"=="F" goto MAIN_MENU

echo Invalid choice. Press any key to try again.
pause >nul
goto ADVANCED

:START_MONITORING
echo.
echo 📊 STARTING MONITORING STACK...
echo Starting monitoring stack at %TIME% >> "%LOGFILE%"
docker-compose -f docker-compose.monitoring.yml up -d
echo Monitoring stack started. Grafana: http://localhost:3000
echo Monitoring stack started at %TIME% >> "%LOGFILE%"
pause
goto ADVANCED

:START_DATABASE
echo.
echo 🗄️ STARTING DATABASE SERVICES...
echo Starting database services at %TIME% >> "%LOGFILE%"
docker-compose up -d postgres redis
echo Database services started. PostgreSQL:5432, Redis:6379
echo Database services started at %TIME% >> "%LOGFILE%"
pause
goto ADVANCED

:START_WONKY
echo.
echo 🎨 STARTING WONKY SPROUT (KIDS ZONE)...
echo Starting Wonky Sprout at %TIME% >> "%LOGFILE%"
start powershell -NoExit -Command "cd wonky-sprout; npm run dev"
echo Wonky Sprout starting on http://localhost:5174
echo Wonky Sprout started at %TIME% >> "%LOGFILE%"
pause
goto ADVANCED

:RUN_SETUP
echo.
echo 🔧 RUNNING SOVEREIGN SETUP SCRIPT...
echo Running setup script at %TIME% >> "%LOGFILE%"
powershell -ExecutionPolicy Bypass -File SOVEREIGN_SETUP.ps1
echo Setup script completed at %TIME% >> "%LOGFILE%"
pause
goto ADVANCED

:VIEW_LOGS
echo.
echo 📁 VIEWING LOGS...
echo.
dir automation_logs\*.log
echo.
set /p logfile="Enter log filename (or press Enter for latest): "
if "%logfile%"=="" (
    for /f "delims=" %%i in ('dir /b /o-d automation_logs\*.log') do set logfile=%%i & goto :SHOW_LOG
)
:SHOW_LOG
if not exist "automation_logs\%logfile%" (
    echo Log file not found.
    pause
    goto ADVANCED
)
echo.
echo ====== LOG: %logfile% ======
type "automation_logs\%logfile%"
echo ====== END LOG ======
echo.
pause
goto ADVANCED

:EXIT
echo.
echo 💜 THE MESH HOLDS. Automation 11/10 complete.
echo.
echo Session ended at %TIME% >> "%LOGFILE%"
exit /b 0
