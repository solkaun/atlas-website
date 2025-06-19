import { defineConfig } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";
import legacy from "@vitejs/plugin-legacy";

export default defineConfig({
  plugins: [
    createHtmlPlugin({
      minify: true,
    }),
    legacy({
      targets: ["defaults", "not IE 11"],
    }),
  ],

  build: {
    outDir: "dist",
    assetsDir: "assets",
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["photoswipe"],
        },
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split(".");
          const ext = info[info.length - 1];
          if (/\.(css)$/.test(assetInfo.name)) {
            return `assets/css/[name].[hash].${ext}`;
          }
          if (/\.(js)$/.test(assetInfo.name)) {
            return `assets/js/[name].[hash].${ext}`;
          }
          if (
            /\.(png|jpe?g|svg|gif|tiff|bmp|ico|webp)$/i.test(assetInfo.name)
          ) {
            return `assets/images/[name].[hash].${ext}`;
          }
          return `assets/[name].[hash].${ext}`;
        },
        chunkFileNames: "assets/js/[name].[hash].js",
        entryFileNames: "assets/js/[name].[hash].js",
      },
    },
    cssCodeSplit: true,
    sourcemap: false,
    reportCompressedSize: true,
    chunkSizeWarningLimit: 1000,
  },

  server: {
    port: 3000,
    open: true,
  },

  css: {
    preprocessorOptions: {
      css: {
        charset: false,
      },
    },
  },

  // Asset handling
  assetsInclude: [
    "**/*.webp",
    "**/*.woff2",
    "**/*.ttf",
    "**/*.eot",
    "**/*.svg",
  ],

  // Performance optimizations
  optimizeDeps: {
    include: ["photoswipe"],
  },
});
