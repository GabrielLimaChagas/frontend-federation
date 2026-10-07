import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from '@tailwindcss/vite'
import { federation } from "@module-federation/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    federation({
      name: "shell",
      remotes: {
        customers: {
          type: "module",
          name: "customers",
          entry: "http://localhost:5174/remoteEntry.js",
          shareScope: "default",
        },
      },
      shared: ["react", "react-dom"],
    }),
  ],
  server: { port: 5173 },
  build: { target: "chrome89" },
});
