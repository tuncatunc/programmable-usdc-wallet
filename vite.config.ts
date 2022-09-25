import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    esbuildOptions: { target: "es2020", supported: { bigint: true } }
  },
  define: {
    'process.env': {},
    global: "globalThis",

  },
  build: {
    target: [ 'es2020' ],
    rollupOptions: {
      plugins: []
    }
  },
  resolve: {
    alias: {
      stream: 'stream-browserify',
    },
  }
})
