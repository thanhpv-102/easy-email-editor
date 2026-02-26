import { defineConfig } from 'vite';
import * as path from 'node:path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.tsx'),
      name: 'SimpleImageAssetManager',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
    },
    outDir: 'dist',
    rollupOptions: {
      external: ['react', 'react-dom', 'antd', '@ant-design/icons'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          antd: 'antd',
          '@ant-design/icons': 'AntDesignIcons',
        },
      },
    },
  },
  plugins: [dts({
    entryRoot: 'src',
    outDir: 'dist',
  })],
});
