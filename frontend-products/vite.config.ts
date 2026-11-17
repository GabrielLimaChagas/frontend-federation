import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from '@tailwindcss/vite'
import { federation } from "@module-federation/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    federation({
      name: "products",
      filename: "remoteEntry.js",
      exposes: { "./ProductList": "./src/pages/ProductList.tsx" },
      shared: ["react", "react-dom"],
    }),
  ],
  test: {
    environment: "jsdom",
    globals: true,
  },
  server: { port: 5175, origin: "http://localhost:5175" },
  preview: { port: 5175 },
  build: { target: "chrome89" },
});


