@echo off
echo ========================================================
echo   Starting Communiti Hyperlocal Discovery Platform
echo ========================================================

set "PATH=C:\Program Files\nodejs;%PATH%"

echo.
echo [1/2] Starting Django REST Backend on http://127.0.0.1:8000 ...
start "Communiti Backend" cmd /k "cd /d %~dp0backend && python manage.py migrate && python manage.py seed_communiti_data && python manage.py runserver 127.0.0.1:8000"

timeout /t 3 /nobreak >nul

echo [2/2] Starting React Vite Frontend on http://localhost:5173 ...
start "Communiti Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ========================================================
echo   Communiti is running!
echo   Frontend : http://localhost:5173
echo   Backend  : http://127.0.0.1:8000
echo   Admin    : admin@communiti.in / Admin@123
echo   Maker    : ananya.bakes@example.com / Entrepreneur@123
echo   Customer : riya.sharma@example.com / Customer@123
echo ========================================================
