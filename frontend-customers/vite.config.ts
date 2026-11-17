import { defineConfig } from "vitest/config";
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
      exposes: { "./CustomerList": "./src/pages/CustomerList.tsx", "./CustomerForm": "./src/pages/CustomerForm.tsx" },
      shared: ["react", "react-dom"],
    }),
  ],
  test: {
    environment: "jsdom",
    globals: true,
  },
  server: { port: 5174, origin: "http://localhost:5174" },
  preview: { port: 5174 },
  build: { target: "chrome89" },
});


