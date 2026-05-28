import { getDPInnsynOboToken } from "~/utils/auth.utils.server";
import { getEnv } from "~/utils/env.utils";
import type { INetworkResponse } from "~/models/networkResponse";
import { logger } from "~/utils/logger.utils";

export interface IGamlePaabegynteSoknad {
  tittel: string;
  sistEndret: string;
  søknadId: string;
  endreLenke: string;
  erNySøknadsdialog: boolean;
}

export async function getGamlePaabegynteSoknader(
  request: Request
): Promise<INetworkResponse<IGamlePaabegynteSoknad[]>> {
  const url = `${getEnv("DP_INNSYN_URL")}/paabegynte`;
  const onBehalfOfToken = await getDPInnsynOboToken(request);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${onBehalfOfToken}`,
    },
  });

  if (!response.ok) {
    logger.error("Feil ved uthenting av fullførte søknader");

    return {
      status: "error",
      error: {
        statusCode: response.status,
        statusText: "Feil ved uthenting av fullførte søknader",
      },
    };
  }

  const data: IGamlePaabegynteSoknad[] = await response.json();

  return {
    status: "success",
    data,
  };
}
