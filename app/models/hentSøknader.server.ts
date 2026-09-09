import type { INetworkResponse } from "~/models/networkResponse";
import { getDPSoknadOrkestratorToken } from "~/utils/auth.utils.server";
import { getEnv } from "~/utils/env.utils";
import { logger } from "~/utils/logger.utils";
import { sorterOgFiltrerSøknader } from "~/utils/søknad.utils";

export interface ISoknad {
  søknadId: string;
  tittel: string;
  innsendtTimestamp: string;
  oppdatertTidspunkt: string;
  status: string;
  manglendeDokumentasjonskrav: string[];
}

export async function hentSøknader(request: Request): Promise<INetworkResponse<ISoknad[]>> {
  const url = `${getEnv("DP_SOKNAD_ORKESTRATOR_URL")}/soknad/mine-soknader`;

  try {
    const onBehalfOfToken = await getDPSoknadOrkestratorToken(request);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${onBehalfOfToken}`,
      },
    });

    if (!response.ok) {
      logger.error("Feil ved uthenting av søknader");

      return {
        status: "error",
        error: {
          statusCode: response.status,
          statusText: "Feil ved uthenting av søknader",
        },
      };
    }

    const data: ISoknad[] = await response.json();
    const søknader: ISoknad[] = sorterOgFiltrerSøknader(data);

    return {
      status: "success",
      data: søknader,
    };
  } catch (error) {
    logger.error(`Feil ved uthenting av søknader: ${error}`);

    return {
      status: "error",
      error: {
        statusCode: 500,
        statusText: "Feil ved uthenting av søknader",
      },
    };
  }
}
