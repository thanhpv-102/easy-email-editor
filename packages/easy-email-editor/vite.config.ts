import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  plugins: [],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@thanhpv102/easy-email-core': path.resolve('../easy-email-core'),
    },
  },
  define: {},
  build: {
    emptyOutDir: false,
    minify: true,
    manifest: false,
    sourcemap: true,
    target: 'es2015',
    lib: {
      entry: path.resolve(__dirname, 'src/index.tsx'),
      name: 'easy-email-editor',
      formats: ['es'],
      fileName: () => 'index.js',
    },
    rollupOptions: {
      plugins: [],
      external: [
        'react',
        'react-dom',
        'react-dom/client',
        'react-dom/server',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
        'mjml-browser',
        'react-hook-form',
        'is-hotkey',
        'lodash',
        'react-use',
        '@thanhpv102/easy-email-core',
      ],
      output: {},
    },
    outDir: 'lib',
  },
  optimizeDeps: {
    include: ['@thanhpv102/easy-email-core'],
  },
  css: {
    modules: {
      localsConvention: 'dashes',
    },
    preprocessorOptions: {
      scss: {},
    },
  },
});
