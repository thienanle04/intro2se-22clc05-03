import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      vue: "vue/dist/vue.esm-bundler.js",
    },
  },
  server: {
    proxy: {
        '/api': {
            target: 'http://localhost:8081', // Your backend server URL
            changeOrigin: true,
        },
    },
  }
})
