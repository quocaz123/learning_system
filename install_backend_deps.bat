@echo off
echo ===================================================
echo  Bat dau tai cac module cho Backend (Python)...
echo ===================================================

REM Di chuyen vao thu muc backend
cd learning_system_BE

REM Kiem tra xem pip da duoc cai dat chua
python -m pip --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [LOI] Khong tim thay pip. Vui long cai dat Python va them vao bien PATH.
    pause
    exit /b
)

REM Cai dat cac module tu file requirements.txt
echo Dang cai dat cac module tu requirements.txt...
pip install -r requirements.txt

if %errorlevel% equ 0 (
    echo.
    echo [OK] Da cai dat xong cac module cho Backend!
) else (
    echo [LOI] Co loi xay ra trong qua trinh cai dat.
)

REM Quay tro ve thu muc goc
cd ..

echo.
pause 