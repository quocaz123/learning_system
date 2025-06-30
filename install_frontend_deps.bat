@echo off
echo ===================================================
echo  Bat dau tai cac module cho Frontend (React)...
echo ===================================================

REM Di chuyen vao thu muc frontend
cd learning_system_FE

REM Kiem tra xem npm da duoc cai dat chua
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [LOI] Khong tim thay npm. Vui long cai dat Node.js.
    pause
    exit /b
)

REM Cai dat cac module tu file package.json
echo Dang cai dat cac module tu package.json (npm install)...
npm install

if %errorlevel% equ 0 (
    echo.
    echo [OK] Da cai dat xong cac module cho Frontend!
) else (
    echo [LOI] Co loi xay ra trong qua trinh cai dat.
)

REM Quay tro ve thu muc goc
cd ..

echo.
pause 