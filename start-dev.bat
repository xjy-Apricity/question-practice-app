@echo off
echo ========================================
echo Starting Dev Environment and Cloudflare Tunnel
echo ========================================
echo.

echo [1/2] Starting Vite Dev Server...
start "Vite Dev Server" cmd /k "cd /d C:\Users\xiong\question-practice-app && npm run dev"

echo [2/2] Waiting 5 seconds...
ping 127.0.0.1 -n 6 > nul

echo [3/3] Starting Cloudflare Tunnel...
start "Cloudflare Tunnel" cmd /k "cd /d C:\cursor\cloud && cloudflared.exe tunnel --protocol http2 run my-app"

echo.
echo ========================================
echo Started Successfully!
echo.
echo Local:  http://localhost:5173
echo Online: https://gjbkstcx.help
echo        https://app.gjbkstcx.help
echo ========================================
echo.
echo Press any key to close...
pause > nul
