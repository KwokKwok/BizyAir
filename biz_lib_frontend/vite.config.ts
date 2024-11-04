import autoprefixer from 'autoprefixer'
import tailwind from 'tailwindcss'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

export default defineConfig({
  define: {
    'process.env': {}
  },
  css: {
    postcss: {
      plugins: [tailwind(), autoprefixer()],
    },
  },
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue'],
    }),
    cssInjectedByJsPlugin()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    outDir: '../js',
    cssCodeSplit: false,
    lib: {
      entry: 'src/main.ts',
      name: 'bizyAirLib',
      formats: ['umd'],
      fileName: () => `biz_lib_frontend.js`,
    },
    rollupOptions: {
      external: [],
      output: {
        inlineDynamicImports: true
      }
    }
  },
  server: {
    proxy: {
      '/bizyair': {
        target: 'http://localhost:8188',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/bizyair/, '/bizyair/')
      }
    }
  }
})
