import { type Faro, getWebInstrumentations, initializeFaro } from "@grafana/faro-web-sdk";
import { TracingInstrumentation } from "@grafana/faro-web-tracing";
import { getEnv } from "~/utils/env.utils";

let faro: Faro | null = null;

export function initFaro() {
  if (typeof document === "undefined" || faro !== null || getEnv("IS_LOCALHOST") === "true") {
    return;
  }

  faro = initializeFaro({
    url: getEnv("FARO_URL"),
    app: {
      name: "dp-mine-dagpenger-frontend",
    },
    sessionTracking: {
      enabled: true,
      persistent: true,
    },
    instrumentations: [
      ...getWebInstrumentations({
        captureConsole: true,
        captureConsoleDisabledLevels: [],
      }),
      new TracingInstrumentation({
        instrumentationOptions: {
          propagateTraceHeaderCorsUrls: [
            new RegExp(`${getEnv("DP_SOKNADSDIALOG_URL")}/*`),
            new RegExp(`${getEnv("DP_INNSYN_URL")}/*`),
            new RegExp(`${getEnv("OKONOMI_KONTOREGISTER_URL")}/*`),
            new RegExp(`${getEnv("PAW_ARBEIDSSOEKERREGISTERET_URL")}/*`),
            new RegExp(`${getEnv("SAF_URL")}/*`),
          ],
        },
      }),
    ],
  });
}
