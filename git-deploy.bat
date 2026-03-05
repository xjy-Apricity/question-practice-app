@echo off
chcp 65001 >nul

echo ========================================
echo 开始部署流程...
echo ========================================
echo.

echo [1/4] 检查 Git 状态...
git status
if errorlevel 1 (
    echo 错误: Git 状态检查失败！
    pause
    exit /b 1
)

echo.
echo [2/4] 添加所有更改到 Git...
git add .
if errorlevel 1 (
    echo 错误: Git add 失败！
    pause
    exit /b 1
)

echo.
echo [3/4] 提交更改...
git commit -m "Update questions and content"
if errorlevel 1 (
    echo 提示: 没有新的更改需要提交
)

echo.
echo [4/4] 推送到 GitHub（最多重试 3 次）...
set retry=0
:push_retry
set /a retry+=1
echo 尝试推送 (第 %retry% 次)...
git push origin main
if errorlevel 1 (
    if %retry% lss 3 (
        echo 推送失败，等待 3 秒后重试...
        timeout /t 3 /nobreak >nul
        goto push_retry
    ) else (
        echo.
        echo ========================================
        echo 错误: 推送到 GitHub 失败！
        echo ========================================
        echo.
        echo 可能的原因:
        echo 1. 网络连接不稳定（连接被重置）
        echo 2. GitHub 服务暂时不可用
        echo 3. 防火墙或代理问题
        echo.
        echo 建议解决方案:
        echo 1. 检查网络连接
        echo 2. 如果使用代理，配置 Git 代理:
        echo    git config --global http.proxy http://127.0.0.1:端口
        echo 3. 或者使用 SSH 方式推送
        echo 4. 稍后重试
        echo.
        pause
        exit /b 1
    )
)

echo.
echo ========================================
echo 部署成功！
echo ========================================
echo.
echo Cloudflare Pages 将自动从 GitHub 部署
echo 访问: https://practice.gjbkstcx.help
echo.
echo 部署通常需要 1-2 分钟完成
echo ========================================
pause
