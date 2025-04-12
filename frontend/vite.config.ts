import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // ✅ necessário para resolver o alias

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // ✅ define @ como alias para /src
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
