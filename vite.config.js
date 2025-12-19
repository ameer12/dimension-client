import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [react()],
  build: {
    // تم التعديل هنا: جعلنا المجلد يخرج في نفس مجلد الكلاينت لسهولة الرفع
    outDir: 'dist', 
    emptyOutDir: true,
    sourcemap: false
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        // تأكد من تغيير هذا الرابط في الإنتاج (Production) إلى رابط السيرفر على Render
        target: 'http://localhost:5000', 
        changeOrigin: true,
        secure: false
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  }
})
