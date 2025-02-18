import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: true,
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true
    })
  ],
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, 'src') }
    ]
  },
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': [
            'react',
            'react-dom',
            'react-router-dom',
            '@tanstack/react-query',
            '@supabase/supabase-js'
          ],
          'admin': [
            './src/pages/Admin.tsx',
            './src/pages/Admin/AdminDashboard.tsx',
            './src/pages/Admin/AdminProjects.tsx',
            './src/pages/Admin/AdminSkills.tsx',
            './src/pages/Admin/AdminCertificates.tsx'
          ],
          'icons': [
            '@heroicons/react'
          ]
        }
      }
    }
  }
})