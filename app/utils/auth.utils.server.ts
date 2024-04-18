import { getToken, requestOboToken, validateToken } from "@navikt/oasis";
import { getEnv } from "./env.utils";

export async function getDPInnsynOboToken(request: Request) {
  const audience = `${process.env.NAIS_CLUSTER_NAME}:teamdagpenger:dp-innsyn`;
  return await getOnBehalfOfToken(request, audience);
}

export async function getPAWArbeidssokerregistreringOboToken(request: Request) {
  const audience = `${process.env.NAIS_CLUSTER_NAME}:paw:paw-arbeidssoekerregisteret-api-oppslag`;
  return await getOnBehalfOfToken(request, audience);
}

export async function getOnBehalfOfToken(request: Request, audience: string) {
  if (getEnv("IS_LOCALHOST") === "true") {
    return "";
  }

  const token = getToken(request);

  if (!token) {
    throw new Response("Missing token", { status: 401 });
  }

  const validation = await validateToken(token);
  if (!validation.ok) {
    throw new Response("Token validation failed", { status: 401 });
  }

  const obo = await requestOboToken(token, audience);
  if (!obo.ok) {
    throw new Response("Unauthorized", { status: 401 });
  }

  return obo.token;
}
