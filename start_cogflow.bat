@echo off
echo ===================================================
echo   Starting CogFlow System
echo   1. Python FastAPI Backend (Port 8000)
echo   2. React Frontend Dev Server (Port 5173)
echo ===================================================

echo Starting FastAPI Backend with DAiSEE BiLSTM Model on port 8000...
start "CogFlow Backend (Port 8000)" cmd /k "cd backend && python -m uvicorn main:app --host 127.0.0.1 --port 8000"

timeout /t 2 /nobreak > nul

echo Starting Frontend on port 5173...
start "CogFlow Frontend (Port 5173)" cmd /k "npm run dev"

echo.
echo CogFlow is running!
echo Open your browser to http://localhost:5173/learn
echo ===================================================
