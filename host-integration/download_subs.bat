@echo off
setlocal

:: CONFIGURATION
set "DOCKER_API_URL=http://localhost:8000/api/download"
set "DRIVE_LETTER=D:\"
set "DOCKER_MOUNT=/data/"

:: Get file path from arguments
set "FILE_PATH=%~1"

if "%FILE_PATH%"=="" (
    echo No file selected.
    pause
    exit /b
)

:: Translate Path (PowerShell for reliability)
:: Replaces D:\ with /data/ and \ with /
for /f "delims=" %%i in ('powershell -Command "$p = '%FILE_PATH%'; $p = $p.Replace('%DRIVE_LETTER%', '%DOCKER_MOUNT%').Replace('\', '/'); Write-Output $p"') do set "DOCKER_PATH=%%i"

echo [Sublify] Requesting download for: %DOCKER_PATH%

:: Send Request using Curl
curl -X POST "%DOCKER_API_URL%" ^
     -H "Content-Type: application/json" ^
     -d "{\"file_path\": \"%DOCKER_PATH%\", \"languages\": [\"en\"]}"

echo.
echo [Sublify] Request sent! Check Web UI for progress.
timeout /t 5
