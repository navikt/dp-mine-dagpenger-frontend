import type { INetworkResponse } from "~/models/networkResponse";
import { getDPSoknadOrkestratorToken } from "~/utils/auth.utils.server";
import { getEnv } from "~/utils/env.utils";
import { logger } from "~/utils/logger.utils";
import {
  hentFullførteSøknader,
  hentPåbegynteSøknad,
  filtrerSøknaderSiste12UkerOgSorterNyesteFørst,
} from "~/utils/søknad.utils";

export interface ISoknad {
  søknadId: string;
  tittel: string;
  innsendtTimestamp: string;
  oppdatertTidspunkt: string;
  status: string;
  manglendeDokumentasjonskrav: string[];
}

export interface ISøknadData {
  fullførteSøknader: ISoknad[];
  påbegyntesøknad: ISoknad | null;
}

export async function hentSøknader(request: Request): Promise<INetworkResponse<ISøknadData>> {
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
      logger.error("Feil ved uthenting av orkestrator søknader");

      return {
        status: "error",
        error: {
          statusCode: response.status,
          statusText: "Feil ved uthenting av orkestrator søknader",
        },
      };
    }

    const alleSøknader: ISoknad[] = await response.json();
    const søknader = filtrerSøknaderSiste12UkerOgSorterNyesteFørst(alleSøknader);
    const fullførteSøknader = hentFullførteSøknader(søknader);
    const påbegynteSøknad = hentPåbegynteSøknad(alleSøknader);

    return {
      status: "success",
      data: {
        fullførteSøknader,
        påbegyntesøknad: påbegynteSøknad ?? null,
      },
    };
  } catch (error) {
    logger.error(`Feil ved uthenting av orkestrator søknader: ${error}`);

    return {
      status: "error",
      error: {
        statusCode: 500,
        statusText: "Feil ved uthenting av orkestrator søknader",
      },
    };
  }
}
