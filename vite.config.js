// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const isDev = mode === "development";

  return {
    plugins: [react()],
    base: isDev ? "/" : "./", // Use relative paths in production
    define: {
      global: "window",
    },
    build: {
      outDir: "dist",
      emptyOutDir: true,
    },
    server: isDev
      ? {
          proxy: {
            "/api": {
              target: "http://localhost:8080",
              changeOrigin: true,
              rewrite: (path) => path.replace(/^\/api/, ""),
            },
            "/ws": {
              target: "http://localhost:8080",
              ws: true,
              changeOrigin: true,
            },
          },
        }
      : undefined,
  };
});
