import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1000,
  },
   css: {
    devSourcemap: false, // ✅ Disable CSS sourcemaps
  },
   define: {
    global: "window", // Fix ReferenceError: global is not defined
  },
});