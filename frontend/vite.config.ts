import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
/* import { visualizer } from 'rollup-plugin-visualizer' */

// Uncomment the line below to enable the visualizer plugin
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  // visualizer({ open: true })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')  
    }
  },
  define: {
    'process.env.NODE_ENV': '"production"',
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          mui: ['@mui/material', '@mui/icons-material'],
          router: ['react-router-dom'],
          supabase: ['@supabase/supabase-js'],
        },
      },
    },
  },
})
