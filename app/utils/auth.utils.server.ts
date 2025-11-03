import { getToken, requestOboToken, validateToken } from "@navikt/oasis";
import { getEnv } from "./env.utils";
import { logger } from "./logger.utils";

export async function getDPInnsynOboToken(request: Request) {
  if (getEnv("IS_LOCALHOST") === "true") {
    return getEnv("DP_INNSYN_TOKEN") || "";
  }

  const audience = `${getEnv("NAIS_CLUSTER_NAME")}:teamdagpenger:dp-innsyn`;
  return await getOnBehalfOfToken(request, audience);
}

export async function getPAWArbeidssokerregistreringOboToken(request: Request) {
  if (getEnv("IS_LOCALHOST") === "true") {
    return getEnv("PAW_ARBEIDSSOEKERREGISTERET_TOKEN") || "";
  }

  const audience = `${getEnv("NAIS_CLUSTER_NAME")}:paw:paw-arbeidssoekerregisteret-api-oppslag-v2`;
  return await getOnBehalfOfToken(request, audience);
}

export async function getOKONOMIKontoregisterToken(request: Request) {
  if (getEnv("IS_LOCALHOST") === "true") {
    return getEnv("OKONOMI_KONTOREGISTER_TOKEN") || "";
  }

  const audience = `${getEnv("NAIS_CLUSTER_NAME")}:okonomi:sokos-kontoregister-person`;
  return await getOnBehalfOfToken(request, audience);
}

export async function getSAFToken(request: Request) {
  if (getEnv("IS_LOCALHOST") === "true") {
    return getEnv("SAF_TOKEN") || "";
  }

  const audience = `${getEnv("SAF_CLUSTER")}:teamdokumenthandtering:${getEnv("SAF_SCOPE")}`;

  return await getOnBehalfOfToken(request, audience);
}

export async function getOnBehalfOfToken(request: Request, audience: string): Promise<string> {
  const token = getToken(request);
  if (!token) {
    logger.error("Missing token");

    throw new Error("Missing token");
  }

  const validation = await validateToken(token);
  if (!validation.ok) {
    logger.error("Token validation failed!");

    throw new Error("Token validation failed!");
  }

  const onBehalfOfToken = await requestOboToken(token, audience);
  if (!onBehalfOfToken.ok) {
    logger.error("onBehalfOfToken not found");
    throw Error("onBehalfOfToken not found");
  }

  return onBehalfOfToken.token;
}
