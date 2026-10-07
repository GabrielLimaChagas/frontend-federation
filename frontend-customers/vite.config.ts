import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from '@tailwindcss/vite'
import { federation } from "@module-federation/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    federation({
      name: "customers",
      filename: "remoteEntry.js",
      exposes: { "./CustomerList": "./src/pages/CustomerList.tsx" },
      shared: ["react", "react-dom"],
    }),
  ],
  server: { port: 5174, origin: "http://localhost:5174" },
  preview: { port: 5174 },
  build: { target: "chrome89" },
});
