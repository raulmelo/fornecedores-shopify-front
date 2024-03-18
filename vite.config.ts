import { defineConfig } from 'vite';
import path from "path";
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';

export default defineConfig({
  plugins: [react(), tailwindcss("./tailwind.config.js")],
  resolve: {
    alias: {
      'src': path.resolve(__dirname, "./src"),
      'components': path.resolve(__dirname, "./src/app/components"),
      'pages': path.resolve(__dirname, "./src/app/pages"),
    },
  },
});
