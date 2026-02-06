import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@demo': path.resolve(__dirname, './src'),
      react: path.resolve('./node_modules/react'),
      'easy-email-localization': path.resolve('../packages/easy-email-localization'),
      'easy-email-core': path.resolve('../packages/easy-email-core'),
      'easy-email-editor': path.resolve('../packages/easy-email-editor'),
      'easy-email-extensions': path.resolve('../packages/easy-email-extensions'),
    },
  },
  optimizeDeps: {},
  define: {},
  build: {
    minify: true,
    manifest: true,
    sourcemap: false,
    target: 'es2015',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (/\/node_modules\/html2canvas\/.*/.test(id)) {
            return 'html2canvas';
          }
          if (/\/node_modules\/lodash\/.*/.test(id)) {
            return 'lodash';
          }
          if (/\/node_modules\/mjml-browser\/.*/.test(id)) {
            return 'mjml-browser';
          }
        },
        chunkFileNames(info) {
          if (
            ['mjml-browser', 'html2canvas', 'browser-image-compression'].some(name =>
              info.name?.includes(name),
            )
          ) {
            return '[name].js';
          }
          return '[name]-[hash].js';
        },
      },
    },
  },
  css: {
    modules: {
      localsConvention: 'dashes',
    },
    preprocessorOptions: {
      scss: {},
      less: {
        javascriptEnabled: true,
      },
    },
  },
  plugins: [
    react(),
    {
      name: 'html-transform',
      transformIndexHtml(html: string) {
        return html.replace(
          '__BUILD_TIME__',
          `<meta name="updated-time" content="${new Date().toUTCString()}" />`
        );
      },
    },
  ].filter(Boolean),
});
