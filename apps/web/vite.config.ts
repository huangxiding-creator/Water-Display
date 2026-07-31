import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { fileURLToPath, URL } from 'node:url'

/**
 * Portable build configuration.
 *
 * Two tiers:
 *  - default (`vite build`)         → multi-file dist, served by start.bat / preview
 *  - static   (`vite build --mode static`) → ONE self-contained index.html,
 *    everything inlined, works by double-clicking in any browser, no Node/server.
 *    `base: './'` keeps every path relative → also file://-safe.
 */
export default defineConfig(({ mode }) => {
  const isStatic = mode === 'static'
  return {
    base: './',
    // Read .env files from the monorepo root so a single root .env.local works.
    envDir: fileURLToPath(new URL('../../', import.meta.url)),
    plugins: [vue(), ...(isStatic ? [viteSingleFile({ removeViteModuleLoader: true })] : [])],
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
    build: {
      outDir: 'dist',
      target: 'es2020',
      cssCodeSplit: false,
      chunkSizeWarningLimit: 10000,
      // inline everything in static mode; in default mode keep small assets inlined too
      assetsInlineLimit: isStatic ? 100 * 1024 * 1024 : 4096,
      rollupOptions: {
        output: {
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash][extname]',
          // In static mode, force a single chunk so everything merges into index.html
          ...(isStatic
            ? { manualChunks: undefined, inlineDynamicImports: true }
            : {
                manualChunks: {
                  echarts: ['echarts'],
                  vue: ['vue', 'vue-router', 'pinia'],
                },
              }),
        },
      },
    },
    server: { port: 5173, host: true, open: true },
    test: { environment: 'jsdom' },
  }
})
