import { initialize } from "unleash-client";
import { getEnv } from "~/utils/env.utils";

export const unleash = initialize({
  url: getEnv("UNLEASH_SERVER_API_URL"),
  appName: "dp-saksbehandling-frontend",
  customHeaders: { Authorization: getEnv("UNLEASH_SERVER_API_TOKEN") },
});
