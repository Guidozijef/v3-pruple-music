import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    open: true,
    proxy: {
      // 代理配置
      "^/api": {
        target: "http://localhost:3000",
        changeOrigin: true, //允许跨域
        secure: false, //解决自签名证书错误
        rewrite: (path) => {
          return path.replace(/^\/api/, "");
        },
      },
    },
  },
});
