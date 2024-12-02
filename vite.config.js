import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs-extra';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'popup.html'),
        background: resolve(__dirname, 'background.js')
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].[hash].js',
        assetFileNames: '[name].[ext]'
      }
    },
    outDir: 'dist',
  },
  server: {
    port: 5173,
    open: '/popup.html',
    cors: true
  },
  base: '',
  plugins: [
    {
      name: 'copy-extension-files',
      writeBundle: async () => {
        // Copy manifest.json
        await fs.copy('manifest.json', 'dist/manifest.json');
        
        // Ensure icons directory exists in dist
        await fs.ensureDir('dist/icons');
        
        // Copy icons
        const iconSizes = [16, 48, 128];
        for (const size of iconSizes) {
          await fs.copy(
            `public/icons/icon${size}.png`,
            `dist/icons/icon${size}.png`
          ).catch(err => {
            console.warn(`Warning: icon${size}.png not found`);
          });
        }
        
        // Copy utils directory
        await fs.copy('utils', 'dist/utils').catch(err => {
          console.error('Error copying utils:', err);
        });
      },
    },
  ],
}); 