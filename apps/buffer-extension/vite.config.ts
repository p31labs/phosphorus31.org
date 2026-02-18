import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        background: resolve(__dirname, "src/background/service-worker.ts"),
        "content-gmail": resolve(__dirname, "src/content/gmail.ts"),
        "content-slack": resolve(__dirname, "src/content/slack.ts"),
        sidepanel: resolve(__dirname, "src/sidepanel/index.html"),
        popup: resolve(__dirname, "src/popup/index.html"),
      },
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "chunks/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
      },
    },
  },
});
