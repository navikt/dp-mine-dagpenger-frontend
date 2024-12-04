import type { SetupServerApi } from "msw/node";
import { setupServer } from "msw/node";
import { handlers } from "./handlers";
import { setMaxListeners } from "events";

export const server = setupServer(...handlers);
export const setup = () => setupServer(...handlers) as SetupServerApi;

export const start = (server: SetupServerApi) => {
  setMaxListeners(30);

  server.listen({ onUnhandledRequest: "warn" });

  process.once("SIGINT", () => server.close());
  process.once("SIGTERM", () => server.close());

  console.info("🔶 Mock server running");
};
