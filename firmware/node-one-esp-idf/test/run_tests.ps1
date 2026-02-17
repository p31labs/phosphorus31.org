# Mock Test Runner Script
# Compiles and runs unit tests without hardware

Write-Host "NODE ONE - MOCK TEST RUNNER" -ForegroundColor Cyan
Write-Host ""

$testDir = $PSScriptRoot
$buildDir = Join-Path $testDir "build"

# Check for compiler
$compiler = $null
if (Get-Command gcc -ErrorAction SilentlyContinue) {
    $compiler = "gcc"
    Write-Host "[OK] Found GCC compiler" -ForegroundColor Green
} elseif (Get-Command clang -ErrorAction SilentlyContinue) {
    $compiler = "clang"
    Write-Host "[OK] Found Clang compiler" -ForegroundColor Green
} else {
    Write-Host "[FAIL] No C compiler found" -ForegroundColor Red
    Write-Host ""
    Write-Host "Install one of:" -ForegroundColor Yellow
    Write-Host "  - MinGW-w64 (includes GCC)" -ForegroundColor Gray
    Write-Host "  - Clang (LLVM)" -ForegroundColor Gray
    Write-Host "  - Visual Studio C++ Build Tools" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Or use WSL/Linux to run tests" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Create build directory
if (-not (Test-Path $buildDir)) {
    New-Item -ItemType Directory -Path $buildDir | Out-Null
}

Write-Host "Compiling tests..." -ForegroundColor Cyan

$sourceFiles = @(
    "test_runner.c",
    "mock_hardware.c",
    "test_bsp.c",
    "test_audio.c",
    "test_lora.c",
    "test_buttons.c",
    "test_display.c"
)

$objectFiles = @()
foreach ($file in $sourceFiles) {
    $srcPath = Join-Path $testDir $file
    $objPath = Join-Path $buildDir ($file -replace '\.c$', '.o')
    
    if (Test-Path $srcPath) {
        Write-Host "  Compiling $file..." -ForegroundColor Gray
        & $compiler -c -o $objPath $srcPath -I$testDir -I(Join-Path $testDir "..") -std=c11 -Wall
        if ($LASTEXITCODE -ne 0) {
            Write-Host "  [FAIL] Compilation failed for $file" -ForegroundColor Red
            exit 1
        }
        $objectFiles += $objPath
    } else {
        Write-Host "  [WARN] Source file not found: $file" -ForegroundColor Yellow
    }
}

# Link
$exePath = Join-Path $buildDir "test_runner.exe"
Write-Host "  Linking..." -ForegroundColor Gray
& $compiler -o $exePath $objectFiles -lm

if ($LASTEXITCODE -ne 0) {
    Write-Host "[FAIL] Linking failed" -ForegroundColor Red
    exit 1
}

Write-Host "[OK] Build successful!" -ForegroundColor Green
Write-Host ""

# Run tests
Write-Host "Running tests..." -ForegroundColor Cyan
Write-Host ""

& $exePath

$exitCode = $LASTEXITCODE

Write-Host ""
if ($exitCode -eq 0) {
    Write-Host "[OK] All tests passed!" -ForegroundColor Green
} else {
    Write-Host "[FAIL] Some tests failed" -ForegroundColor Red
}

Write-Host ""
Write-Host "The Mesh Holds." -ForegroundColor Cyan

exit $exitCode
