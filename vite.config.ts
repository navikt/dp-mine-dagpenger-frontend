import { reactRouter } from "@react-router/dev/vite";
import path from "path";
import { defineConfig, type Plugin } from "vite";
import devtoolsJson from "vite-plugin-devtools-json";

const basePath = "/arbeid/dagpenger/mine-dagpenger";
const ignoreReactRouterCriticalCss: Plugin = {
  name: "ignore-react-router-critical-css",
  configureServer(server) {
    server.middlewares.use((request, response, next) => {
      if (request.url?.startsWith(`${basePath}@react-router/critical.css`)) {
        response.statusCode = 204;
        response.end();
        return;
      }

      next();
    });
  },
};

export default defineConfig({
  base:
    process.env.NODE_ENV === "production"
      ? "https://cdn.nav.no/teamdagpenger/dp-mine-dagpenger-frontend/client/"
      : basePath,
  plugins: [ignoreReactRouterCriticalCss, reactRouter(), devtoolsJson()],
  build: {
    manifest: true,
    sourcemap: process.env.NODE_ENV !== "production",
  },
  resolve: {
    tsconfigPaths: true,
    alias: {
      "~": path.resolve(import.meta.dirname, "./app"),
    },
  },
});
