import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5173, 
    open: true,
    historyApiFallback: true,
  },
  preview:{
    port: 4173,
  },
  build: {
    outDir: "dist",
  },
  base: "/", 
  plugins: [react(),tailwindcss()],
  root: '.',
});
