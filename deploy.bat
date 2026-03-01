@echo off
chcp 65001 >nul
echo Building project...
call npm run build
if %errorlevel% neq 0 (
    echo Build failed!
    pause
    exit /b %errorlevel%
)

echo.
echo Deploying to Cloudflare Pages...
call npx wrangler pages deploy dist --project-name=question-practice-app

echo.
echo Deploy complete! Visit: https://practice.gjbkstcx.help
pause
