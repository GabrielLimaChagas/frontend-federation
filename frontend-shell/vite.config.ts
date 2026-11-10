import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { federation } from "@module-federation/vite";

export default defineConfig(({ mode }) => {
  const isDev = mode === "development";

  const customersEntry = isDev
    ? "http://localhost:5174/remoteEntry.js"
    : "/frontend-customers/remoteEntry.js";

  const productsEntry = isDev
    ? "http://localhost:5175/remoteEntry.js"
    : "/frontend-products/remoteEntry.js";

  return {
    plugins: [
      react(),
      tailwindcss(),
      federation({
        name: "shell",
        remotes: {
          customers: {
            type: "module",
            name: "customers",
            entry: customersEntry,
            entryGlobalName: "customers",
            shareScope: "default",
          },
          products: {
            type: "module",
            name: "products",
            entry: productsEntry,
            entryGlobalName: "products",
            shareScope: "default",
          },
        },
        shared: ["react", "react-dom"],
      }),
    ],
    server: { port: 5173 },
    build: { target: "chrome89" },
  };
});
