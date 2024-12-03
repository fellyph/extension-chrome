import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs-extra';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'popup.html'),
        background: resolve(__dirname, 'background.ts'),
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
  plugins: [
    {
      name: 'copy-extension-files',
      writeBundle: async () => {
        // Copy manifest.json
        await fs.copy('manifest.json', 'dist/manifest.json');

        // Copy icons directory
        await fs.copy('public/icons', 'dist/icons').catch((err) => {
          console.error('Error copying icons:', err);
        });

        // Copy utils directory
        await fs.copy('utils', 'dist/utils').catch((err) => {
          console.error('Error copying utils:', err);
        });
      },
    },
  ],
});
