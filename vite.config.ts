import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import fs from 'fs-extra';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-extension-files',
      writeBundle: async () => {
        await fs.copy('manifest.json', 'dist/manifest.json');
        await fs.copy('public/icons', 'dist/icons').catch((err) => {
          console.error('Error copying icons:', err);
        });
      },
    },
  ],
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'popup.html'),
        background: 'src/background.ts',
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].[hash].js',
        assetFileNames: '[name].[ext]',
      },
    },
    outDir: 'dist',
  },
  server: {
    port: 5173,
    open: '/popup.html',
    cors: true,
  },
  base: '',
});
