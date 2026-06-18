import { defineConfig } from 'vite';
import path from 'path';
import visualizer from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    process.env.ANALYZE === 'true' &&
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ].filter(Boolean) as any,
  resolve: {
    alias: {
      '@extensions': path.resolve('./src'),
      '@thanhpv102/easy-email-core': path.resolve('../easy-email-core/lib'),
      '@thanhpv102/easy-email-editor': path.resolve('../easy-email-editor/lib'),
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
      name: 'easy-email-extension',
      formats: ['es'],
      fileName: () => 'index.js',
    },
    rollupOptions: {
      plugins: [],
      onwarn(warning, warn) {
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE' && warning.message.includes('"use client"')) {
          return;
        }
        warn(warning);
      },
      external: [
        'react',
        'react-dom',
        'react-dom/client',
        'react-dom/server',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
        'mjml-browser',
        'react-hook-form',
        '@ant-design/icons',
        '@thanhpv102/easy-email-core',
        '@thanhpv102/easy-email-editor',
        'antd',
        'color',
        'is-hotkey',
        'lodash',
        'overlayscrollbars',
        'overlayscrollbars-react',
        'codemirror',
        'codemirror/mode/xml/xml.js',
        'react-codemirror2',
        'react-colorful',
        'react-use',
        'uuid',
      ],
      output: {},
    },
    outDir: 'lib',
  },
  optimizeDeps: {},
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
});
