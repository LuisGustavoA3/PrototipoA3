import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import { fileURLToPath, URL } from "node:url";
import { apiPlugin } from "./server/vite-api";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  // Server credentials stay in Node; never define them in the client bundle.
  for (const key of ["MONDAY_API_TOKEN"]) {
    if (env[key]) process.env[key] = env[key];
  }
  return {
    plugins: [react(), apiPlugin()],
    resolve: {
      alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
    },
  };
});
