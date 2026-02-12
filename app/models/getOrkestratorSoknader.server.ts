import type { INetworkResponse } from "~/models/networkResponse";
import { getDPSoknadOrkestratorToken } from "~/utils/auth.utils.server";
import { getEnv } from "~/utils/env.utils";
import { logger } from "~/utils/logger.utils";

export interface ISoknadResponse {
  søknadId: string;
  tittel: string;
  innsendtTimestamp: string;
  oppdatertTidspunkt: string;
  status: string;
}

export async function getOrkestratorSoknader(
  request: Request,
): Promise<INetworkResponse<ISoknadResponse[]>> {
  const url = `${getEnv("DP_SOKNAD_ORKESTRATOR_URL")}/soknad/mine-soknader`;
  const onBehalfOfToken = await getDPSoknadOrkestratorToken(request);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${onBehalfOfToken}`,
    },
  });

  if (!response.ok) {
    logger.error("Feil ved uthenting av orkestrator søknader");

    return {
      status: "error",
      error: {
        statusCode: response.status,
        statusText: "Feil ved uthenting av orkestrator søknader",
      },
    };
  }

  const data: ISoknadResponse[] = await response.json();

  const soknaderMedEndreLenke: ISoknadResponse[] = data
    .sort((a, b) => new Date(b.oppdatertTidspunkt).getTime() - new Date(a.oppdatertTidspunkt).getTime())
    .filter(søknad => søknad.status !== "SLETTET_AV_SYSTEMET");

  return {
    status: "success",
    data: soknaderMedEndreLenke,
  };
}
