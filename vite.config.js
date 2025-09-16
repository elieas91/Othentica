import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
      jsxImportSource: 'react',
    }),
    viteStaticCopy({
      targets: [
        {
          src: 'src/assets/fonts/**/*',
          dest: 'assets/fonts'
        }
      ]
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // React core - keep together for better caching
          if (id.includes('react/') || id.includes('react-dom/')) {
            return 'react-core';
          }
          // React Router - separate chunk
          if (id.includes('react-router')) {
            return 'router';
          }
          // UI Libraries - split by usage frequency
          if (id.includes('@heroicons/react/24/outline')) {
            return 'heroicons-outline';
          }
          if (id.includes('@heroicons/react/24/solid')) {
            return 'heroicons-solid';
          }
          if (id.includes('react-icons/fa')) {
            return 'react-icons-fa';
          }
          if (id.includes('react-icons/')) {
            return 'react-icons';
          }
          // Heavy libraries - separate chunks
          if (id.includes('react-datepicker')) {
            return 'datepicker';
          }
          if (id.includes('swiper')) {
            return 'swiper';
          }
          if (id.includes('sweetalert2')) {
            return 'sweetalert';
          }
          if (id.includes('googleapis')) {
            return 'googleapis';
          }
          if (id.includes('next-themes')) {
            return 'themes';
          }
          // Large vendor libraries
          if (id.includes('node_modules')) {
            // Keep small utilities together
            if (id.includes('lodash') || id.includes('moment') || id.includes('date-fns')) {
              return 'utils';
            }
            return 'vendor';
          }
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          // Font files
          if (assetInfo.name && /\.(ttf|woff|woff2|eot|otf)$/i.test(assetInfo.name)) {
            return 'assets/fonts/[name]-[hash][extname]';
          }
          // Images
          if (assetInfo.name && /\.(png|jpe?g|gif|svg|webp|ico)$/i.test(assetInfo.name)) {
            return 'assets/images/[name]-[hash][extname]';
          }
          // Videos
          if (assetInfo.name && /\.(mp4|webm|ogg)$/i.test(assetInfo.name)) {
            return 'assets/videos/[name]-[hash][extname]';
          }
          // Other assets
          return 'assets/[name]-[hash][extname]';
        },
      },
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false,
      },
    },
    minify: 'esbuild',
    chunkSizeWarningLimit: 1000,
    // Optimize asset handling
    assetsInlineLimit: 4096, // Inline assets smaller than 4kb
    // CSS optimization
    cssCodeSplit: true,
    cssMinify: true,
    // JavaScript optimization
    target: 'es2020',
    sourcemap: false,
  },
  css: {
    devSourcemap: false,
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
    target: 'es2020',
    format: 'esm'
  },
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom',
      '@heroicons/react',
      'react-icons',
      'react-datepicker',
      'swiper',
      'sweetalert2'
    ],
    force: true
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
    '__BUILD_TIME__': JSON.stringify(new Date().toISOString())
  }
})
