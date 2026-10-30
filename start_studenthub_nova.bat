@echo off
chcp 65001 >nul
title StudentHub-AI x Nova OS - 1-Click Local Launcher
color 0A

echo ===============================================================================
echo     STUDENTHUB-AI x NOVA OS v4.0 - LOCAL LAUNCHER
echo     4-Layer Server-Authoritative Cyber Defense & 120FPS Hybrid 3D Engine
echo ===============================================================================
echo.

set ROOT_DIR=%~dp0
cd /d "%ROOT_DIR%"

echo [1/3] Kiểm tra môi trường Python & Node.js...
where python >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Không tìm thấy Python trên PATH. Vui lòng cài đặt Python 3.10+.
    pause
    exit /b 1
)

where npm.cmd >nul 2>&1
if %errorlevel% neq 0 (
    where npm >nul 2>&1
    if %errorlevel% neq 0 (
        echo [ERROR] Không tìm thấy npm trên PATH. Vui lòng cài đặt Node.js LTS.
        pause
        exit /b 1
    )
)

echo [✓] Môi trường hợp lệ!
echo.

echo [2/3] Khởi chạy FastAPI Backend (Port 8000)...
cd /d "%ROOT_DIR%studenthub-nova\apps\api"
start "StudentHub-Nova FastAPI Backend (Port 8000)" cmd /k "python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload"

echo [✓] Backend đang khởi động tại: http://localhost:8000
echo.

echo [3/3] Khởi chạy StudentHub-AI Frontend (Port 5173)...
cd /d "%ROOT_DIR%StudentHub-AI"
start "StudentHub-AI Vite Frontend (Port 5173)" cmd /k "npm.cmd run dev -- --host 0.0.0.0 --port 5173"

echo [✓] Frontend đang khởi động tại: http://localhost:5173
echo.

echo -------------------------------------------------------------------------------
echo [THÔNG TIN TRUY CẬP HỆ THỐNG]:
echo   - 🌐 Giao diện Web 3D & Nova OS Desktop: http://localhost:5173
echo   - 🛡️ FastAPI OpenAPI Swagger Docs:      http://localhost:8000/docs
echo   - 📊 Trạng thái Backend Health:          http://localhost:8000/health
echo   - 🛂 Hộ chiếu Năng lực Sinh viên (VC):    http://localhost:8000/api/v1/passport/proof
echo   - 🔬 Benchmark Thực nghiệm RQ1-RQ3:      http://localhost:8000/api/v1/evaluation/report
echo -------------------------------------------------------------------------------
echo.
echo Đang mở trình duyệt mặc định...
timeout /t 3 /nobreak >nul
start http://localhost:5173

echo.
echo Nhấn phím bất kỳ hoặc đóng cửa sổ này khi hoàn tất.
echo (Để tắt toàn bộ hệ thống, hãy chạy file stop_studenthub_nova.bat)
echo.
pause
