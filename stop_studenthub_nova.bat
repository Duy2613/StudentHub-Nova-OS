@echo off
chcp 65001 >nul
title StudentHub-AI x Nova OS - 1-Click Stopper
color 0C

echo ===============================================================================
echo     STUDENTHUB-AI x NOVA OS - SHUTDOWN DAEMONS
echo ===============================================================================
echo.

echo Đang tìm và giải phóng Port 8000 (FastAPI Backend)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8000" ^| findstr "LISTENING"') do (
    echo [KILL] Đang tắt PID %%a trên port 8000...
    taskkill /f /pid %%a >nul 2>&1
)

echo Đang tìm và giải phóng Port 5173 (Vite Frontend)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173" ^| findstr "LISTENING"') do (
    echo [KILL] Đang tắt PID %%a trên port 5173...
    taskkill /f /pid %%a >nul 2>&1
)

echo.
echo [✓] Đã giải phóng hoàn tất toàn bộ các dịch vụ StudentHub-AI & Nova OS!
echo.
timeout /t 3
exit /b 0
