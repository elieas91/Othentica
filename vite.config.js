import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import { reactChildrenPolyfill } from './vite-plugin-react-children-polyfill.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
    }),
    reactChildrenPolyfill(),
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
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    }
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
    force: true,
    esbuildOptions: {
      target: 'es2020'
    }
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
    '__BUILD_TIME__': JSON.stringify(new Date().toISOString())
  },
  resolve: {
    dedupe: ['react', 'react-dom', 'scheduler']
  }
})
