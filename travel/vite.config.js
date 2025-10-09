import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    hmr: {
      overlay: false, // Disables the error overlay if it's too intrusive
    },
    host: "localhost", // Explicitly set host
    port: 5173, // Explicitly set port
  },
});
