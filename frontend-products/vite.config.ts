import { defineConfig } from "vite";
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
  server: { port: 5175, origin: "http://localhost:5175" },
  preview: { port: 5175 },
  build: { target: "chrome89" },
});
