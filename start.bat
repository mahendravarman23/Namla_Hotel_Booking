@echo off
title Hotel Management System Runner
echo ========================================================
echo Starting Hotel Management System (Backend + Frontend)
echo ========================================================

cd /d "%~dp0"

if exist "hotel-app\backend" (
    echo Starting Backend Server on http://localhost:4001 ...
    start "Hotel App - Backend Server (Port 4001)" cmd /k "cd hotel-app\backend && npm start"
    echo Starting Frontend on http://localhost:5173 ...
    start "Hotel App - Frontend (Port 5173)" cmd /k "cd hotel-app\frontend && npm run dev"
) else (
    echo Starting Backend Server on http://localhost:4001 ...
    start "Hotel App - Backend Server (Port 4001)" cmd /k "cd backend && npm start"
    echo Starting Frontend on http://localhost:5173 ...
    start "Hotel App - Frontend (Port 5173)" cmd /k "cd frontend && npm run dev"
)

echo.
echo Both servers have been launched in separate windows!
echo Backend:  http://localhost:4001
echo Frontend: http://localhost:5173
echo.
timeout /t 3 >nul
