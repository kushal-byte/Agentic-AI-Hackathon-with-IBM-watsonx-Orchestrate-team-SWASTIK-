import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://api.eu-de.watson-orchestrate.cloud.ibm.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/iam': {
        target: 'https://iam.cloud.ibm.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/iam/, ''),
      },
    },
  },
});
