declare global {
  interface Window {
    env: IEnv;
  }
}

interface IEnv {
  BASE_PATH: string;
  USE_MSW: string;
  IS_LOCALHOST: string;
  PAW_ARBEIDSSOEKERREGISTERET_URL: string;
  DP_SOKNADSDIALOG_URL: string;
  DP_INNSYN_URL: string;
  OKONOMI_KONTOREGISTER_URL: string;
}

export function getEnv(value: keyof IEnv) {
  const env = typeof window !== "undefined" ? window.env : process.env;

  return env[value] || "";
}
