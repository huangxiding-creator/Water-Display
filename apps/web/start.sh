#!/usr/bin/env bash
# ============================================================
#  江巷灌区数字孪生平台 — 一键启动（macOS / Linux）
#  双击或 ./start.sh 即可在浏览器中打开展示平台。
#  需要：Node.js（若已使用单文件版 index.html 则无需 Node）
# ============================================================
set -e
cd "$(dirname "$0")"
echo
echo "  正在启动 江巷灌区数字孪生平台 ..."
echo
if command -v node >/dev/null 2>&1; then
  node serve.mjs 5174 dist
else
  echo "  [提示] 未检测到 Node.js，正在使用单文件版直接打开..."
  if [ -f "dist/index.html" ]; then
    if command -v open >/dev/null 2>&1; then open "dist/index.html"
    elif command -v xdg-open >/dev/null 2>&1; then xdg-open "dist/index.html"
    else echo "  请手动打开 dist/index.html"; fi
  else
    echo "  [错误] 未找到 dist/index.html，请先运行 pnpm build:static"
    exit 1
  fi
fi
