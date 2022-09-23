import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    esbuildOptions: { target: "es2020" }
  },
  define: {
    'process.env': {}
  },
  resolve: {
    alias: {
      stream: 'stream-browserify',
    },
  }
})
