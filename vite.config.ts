import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { markenEntfernen } from './src/lib/begriffe';

export default defineConfig({
  plugins: [markenEntfernen(), react()],
  base: './',
  build: { sourcemap: true },
});
