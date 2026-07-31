#!/usr/bin/env node
/**
 * Zero-dependency static file server for the Water-Display showcase.
 * Used by start.bat / start.sh (portability tier B). Serves the built dist/
 * with correct MIME types so Cesium / module assets work; tier A (single-file
 * index.html) needs no server at all.
 *
 * Usage: node serve.mjs [port] [dir]
 */
import http from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const port = Number(process.argv[2]) || 5174
const root = process.argv[3] ? join(__dirname, process.argv[3]) : join(__dirname, 'dist')

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
  '.wasm': 'application/wasm',
}

const server = http.createServer(async (req, res) => {
  try {
    const urlPath = decodeURIComponent(new URL(req.url, `http://localhost`).pathname)
    let filePath = normalize(join(root, urlPath))
    if (!filePath.startsWith(root)) {
      res.writeHead(403)
      res.end('Forbidden')
      return
    }
    const s = await stat(filePath).catch(() => null)
    if (s?.isDirectory()) filePath = join(filePath, 'index.html')
    const data = await readFile(filePath)
    res.writeHead(200, { 'Content-Type': MIME[extname(filePath)] ?? 'application/octet-stream' })
    res.end(data)
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
    res.end('404 Not Found')
  }
})

server.listen(port, () => {
  const url = `http://localhost:${port}`
  // eslint-disable-next-line no-console
  console.log(`\n  江巷灌区数字孪生平台 — 展示服务已启动`)
  console.log(`  → ${url}\n`)
  // Try to open the browser (best effort)
  import('node:child_process').then(({ exec }) => {
    const cmd = process.platform === 'win32' ? `start "" "${url}"`
      : process.platform === 'darwin' ? `open "${url}"`
      : `xdg-open "${url}"`
    exec(cmd, () => {})
  })
})
