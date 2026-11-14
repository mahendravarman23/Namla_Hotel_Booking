@echo off
title Hotel Management System Runner
echo ========================================================
echo Starting Hotel Management System (Backend + Frontend)
echo ========================================================

cd /d "%~dp0"

if exist "hotel-app\server" (
    echo Starting Backend Server on http://localhost:4001 ...
    start "Hotel App - Backend Server (Port 4001)" cmd /k "cd hotel-app\server && npm start"
    echo Starting Frontend Client on http://localhost:5173 ...
    start "Hotel App - Frontend Client (Port 5173)" cmd /k "cd hotel-app\client && npm run dev"
) else (
    echo Starting Backend Server on http://localhost:4001 ...
    start "Hotel App - Backend Server (Port 4001)" cmd /k "cd server && npm start"
    echo Starting Frontend Client on http://localhost:5173 ...
    start "Hotel App - Frontend Client (Port 5173)" cmd /k "cd client && npm run dev"
)

echo.
echo Both servers have been launched in separate windows!
echo Backend:  http://localhost:4001
echo Frontend: http://localhost:5173
echo.
timeout /t 3 >nul
