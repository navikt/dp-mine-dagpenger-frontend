import type { INetworkResponse } from "~/models/networkResponse";
import { getDPInnsynOboToken } from "~/utils/auth.utils.server";
import { getEnv } from "~/utils/env.utils";
import { logger } from "~/utils/logger.utils";

export interface ISoknad {
  søknadId: string;
  erNySøknadsdialog: boolean;
  endreLenke: string;
  skjemaKode: string;
  tittel: string;
  journalpostId: string;
  søknadsType: string;
  kanal: string;
  datoInnsendt: string;
  vedlegg?: IVedlegg[];
}

interface IVedlegg {
  skjemaNummer: string;
  navn: string;
  status: string;
}

export async function getFullforteSoknader(request: Request): Promise<INetworkResponse<ISoknad[]>> {
  const url = `${getEnv("DP_INNSYN_URL")}/soknad`;
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

  const data: ISoknad[] = await response.json();

  return {
    status: "success",
    data,
  };
}
