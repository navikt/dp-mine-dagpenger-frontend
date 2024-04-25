import { getToken, requestOboToken, validateToken } from "@navikt/oasis";

export async function getDPInnsynOboToken(request: Request) {
  if (process.env.IS_LOCALHOST === "true") {
    return process.env.DP_INNSYN_TOKEN || "";
  }

  const audience = `${process.env.NAIS_CLUSTER_NAME}:teamdagpenger:dp-innsyn`;
  return await getOnBehalfOfToken(request, audience);
}

export async function getPAWArbeidssokerregistreringOboToken(request: Request) {
  if (process.env.IS_LOCALHOST === "true") {
    return process.env.PAW_ARBEIDSSOEKERREGISTERET_TOKEN || "";
  }

  const audience = `${process.env.NAIS_CLUSTER_NAME}:paw:paw-arbeidssoekerregisteret-api-oppslag`;
  return await getOnBehalfOfToken(request, audience);
}

export async function getOKONOMIKontoregisterToken(request: Request) {
  if (process.env.IS_LOCALHOST === "true") {
    return process.env.OKONOMI_KONTOREGISTER_TOKEN || "";
  }

  const audience = `${process.env.NAIS_CLUSTER_NAME}:okonomi:sokos-kontoregister-person`;
  return await getOnBehalfOfToken(request, audience);
}

export async function getOnBehalfOfToken(request: Request, audience: string): Promise<string> {
  const token = getToken(request);
  if (!token) {
    throw new Error("missing token");
  }

  const validation = await validateToken(token);
  if (!validation.ok) {
    throw new Error("token validation failed!");
  }

  const onBehalfOfToken = await requestOboToken(token, audience);

  if (!onBehalfOfToken.ok) {
    throw Error("onBehalfOfToken not found");
  }

  return onBehalfOfToken.token;
}
