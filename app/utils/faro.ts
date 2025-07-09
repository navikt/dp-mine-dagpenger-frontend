import { type Faro, getWebInstrumentations, initializeFaro } from "@grafana/faro-web-sdk";
import { TracingInstrumentation } from "@grafana/faro-web-tracing";
import { getEnv } from "~/utils/env.utils";

// EscapeRegExp sørger for at alle spesialtegn i en streng blir escaped før bruk i RegExp.
// Dette forhindrer Regular Expression Injection, som kan føre til sikkerhetsproblemer.
// Se: https://owasp.org/www-community/attacks/Regular_expression_Denial_of_Service_-_ReDoS
function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

let faro: Faro | null = null;

export function initFaro() {
  if (typeof document === "undefined" || faro !== null) {
    return;
  }

  if (getEnv("IS_LOCALHOST") === "true") {
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
            new RegExp(`${escapeRegExp(getEnv("DP_SOKNADSDIALOG_URL"))}/.*`),
            new RegExp(`${escapeRegExp(getEnv("DP_INNSYN_URL"))}/.*`),
            new RegExp(`${escapeRegExp(getEnv("OKONOMI_KONTOREGISTER_URL"))}/.*`),
            new RegExp(`${escapeRegExp(getEnv("PAW_ARBEIDSSOEKERREGISTERET_URL"))}/.*`),
            new RegExp(`${escapeRegExp(getEnv("SAF_URL"))}/.*`),
          ],
        },
      }),
    ],
  });
}
