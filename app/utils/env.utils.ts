declare global {
  interface Window {
    env: IEnv;
  }
}

interface IEnv {
  APP_ENV: string;
  BASE_PATH: string;
  IS_LOCALHOST: string;
  USE_MSW: string;
  DEKORATOR_ENV: string;
  DP_SOKNADSDIALOG_URL: string;
  DP_INNSYN_URL: string;
  DP_INNSYN_TOKEN: string;
  OKONOMI_KONTOREGISTER_URL: string;
  OKONOMI_KONTOREGISTER_TOKEN: string;
  PAW_ARBEIDSSOEKERREGISTERET_URL: string;
  PAW_ARBEIDSSOEKERREGISTERET_TOKEN: string;
  DP_SOKNAD_ORKESTRATOR_URL: string;
  DP_SOKNAD_ORKESTRATOR_TOKEN: string;
  NAIS_CLUSTER_NAME: string;
  SAF_URL: string;
  SAF_TOKEN: string;
  SAF_SCOPE: string;
  SAF_CLUSTER: string;
  UXSIGNALS_ENABLED: string;
  UXSIGNALS_MODE: string;
  UNLEASH_SERVER_API_URL: string;
  UNLEASH_SERVER_API_TOKEN: string;
  SANITY_DATASET: string;
  FARO_URL: string;
}

export function getEnv(value: keyof IEnv) {
  const env = typeof window !== "undefined" ? window.env : process.env;

  return env[value] || "";
}
