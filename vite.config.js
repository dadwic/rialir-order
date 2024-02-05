import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'main.js',
        assetFileNames: 'main.css',
        chunkFileNames: 'main.js',
      },
    },
  },
});
