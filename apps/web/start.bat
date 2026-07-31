@echo off
chcp 65001 >nul
REM ============================================================
REM  江巷灌区数字孪生平台 — 一键启动（Windows）
REM  双击此脚本即可在浏览器中打开展示平台。
REM  需要：Node.js（若已使用单文件版 index.html 则无需 Node）
REM ============================================================
cd /d "%~dp0"
echo.
echo  正在启动 江巷灌区数字孪生平台 ...
echo.
where node >nul 2>nul
if %errorlevel%==0 (
  node serve.mjs 5174 dist
  goto :eof
)
echo  [提示] 未检测到 Node.js，正在使用单文件版直接打开...
if exist "dist\index.html" (
  start "" "dist\index.html"
) else (
  echo  [错误] 未找到构建产物 dist\index.html，请先运行 pnpm build:static
  pause
)
