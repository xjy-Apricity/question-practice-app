@echo off
chcp 65001 >nul
echo Adding changes to git...
git add .

echo.
echo Committing changes...
git commit -m "Update questions and content"

echo.
echo Pushing to GitHub...
git push origin main

echo.
echo Deploy complete! Cloudflare Pages will auto-deploy from GitHub.
echo Visit: https://practice.gjbkstcx.help
pause
