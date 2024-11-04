/// <reference types="vitest/config" />
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    alias: {
      "@/server": path.resolve(__dirname, "./src/server"),
      "@/client": path.resolve(__dirname, "./src/client"),
    },
  },
});
