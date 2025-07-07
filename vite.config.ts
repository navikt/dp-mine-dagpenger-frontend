import { reactRouter } from "@react-router/dev/vite";
import path from "path";
import { defineConfig } from "vite";
import devtoolsJson from "vite-plugin-devtools-json";
import tsconfigPaths from "vite-tsconfig-paths";

// const basePath = "/arbeid/dagpenger/mine-dagpenger/";

export default defineConfig({
  // base: basePath,
  plugins: [reactRouter(), tsconfigPaths(), devtoolsJson()],
  build: {
    manifest: true,
    sourcemap: process.env.NODE_ENV !== "production",
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./app"),
    },
  },
});
