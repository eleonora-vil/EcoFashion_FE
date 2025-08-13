import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Cố định port 5173
    // Cấu hình để kết nối với HTTPS backend
    proxy: {
      "/api": {
        target: "http://localhost:5148",
        changeOrigin: true,
        secure: false, // Bỏ qua SSL certificate validation cho localhost
        configure: (proxy, _options) => {
          proxy.on("error", (err, _req, _res) => {
            console.error("Proxy error:", err);
          });
        },
      },
    },
  },
});
