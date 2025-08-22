import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin';
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue({
      template: {
        transformAssetUrls,
      },
    }),
   quasar({
      sassVariables: 'src/css/quasar.variables.scss',
    }),],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      'src': resolve(__dirname, './src'),
      'components': resolve(__dirname, './src/components'),
      'layouts': resolve(__dirname, './src/layouts'),
      'pages': resolve(__dirname, './src/pages'),
      'assets': resolve(__dirname, './src/assets'),
      'boot': resolve(__dirname, './src/boot'),
      'stores': resolve(__dirname, './src/stores')
    }
  },
})
