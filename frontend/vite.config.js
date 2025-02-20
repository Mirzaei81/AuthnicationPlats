import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  base: "/auth",
  server: {
    proxy: {//it's for dev seerver only
      "/api/auth": {
        target: "http://127.0.0.1:8000/auth", // Main server address
        changeOrigin: true, // Request to modify the Origin header
        secure:false,
      },
    },
  },
});
