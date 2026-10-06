import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "customers",
      filename: "remoteEntry.js",
      exposes: { "./src/components/pages/CustomerList.tsx": "./src/components/pages/CustomerForm.tsx" },
      shared: ["react", "react-dom"],
    }),
  ],
  server: { port: 5174, origin: "http://localhost:5174" },
  preview: { port: 5174 },
  build: { target: "chrome89" },
});
