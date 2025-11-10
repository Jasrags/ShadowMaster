import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: resolve(__dirname, '../static/dist'),
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, 'src/main.tsx'),
      name: 'ShadowmasterWebApp',
      formats: ['es'],
      fileName: () => 'main.js'
    },
    rollupOptions: {
      // Ensure React and other deps are bundled for now; revisit when splitting chunks
      external: [],
      output: {
        assetFileNames: 'assets/[name][extname]'
      }
    }
  }
});
