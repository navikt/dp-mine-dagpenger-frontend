import type { INetworkResponse } from "~/models/networkResponse";
import { getDPSoknadOrkestratorToken } from "~/utils/auth.utils.server";
import { getEnv } from "~/utils/env.utils";
import { logger } from "~/utils/logger.utils";

export interface ISoknad {
  søknadId: string;
  tittel: string;
  datoInnsendt: string;
  status: string;
}

export async function getOrkestratorSoknader(
  request: Request
): Promise<INetworkResponse<ISoknad[]>> {
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

  const data: ISoknad[] = await response.json();

  return {
    status: "success",
    data,
  };
}
