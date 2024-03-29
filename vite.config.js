import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

// Указываем, что при сборке результаты должны помещаться в папку 'dist'
const outDir = path.resolve(__dirname, "dist");

export default defineConfig({
  plugins: [vue()],
  build: {
    minify: false,
    outDir: outDir,
    sourcemap: true,
    emptyOutDir: true, // Очищаем папку сборки перед сборкой
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "src/main.js"), // основная точка входа для вашего приложения
      },
      output: {
        // Настройки, чтобы имена файлов оставались постоянными
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`,
      },
    },
  },
});
