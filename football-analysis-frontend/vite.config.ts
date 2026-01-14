import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig({
  plugins: [
    solid(),
    UnoCSS(),
    AutoImport({
      imports: [
        'solid-js',
      ],
      dts: './src/auto-imports.d.ts',
    }),
  ],
  server: {
    port: 5173,
    proxy: {
      '/foot': {
        target: 'http://localhost:9000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          'solid': ['solid-js'],
        },
      },
    },
  },
})
