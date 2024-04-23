import { getDPInnsynOboToken } from "~/utils/auth.utils.server";
import { getEnv } from "~/utils/env.utils";

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

export interface IPaabegynteSoknad {
  tittel: string;
  sistEndret: string;
  søknadId: string;
  endreLenke: string;
  erNySøknadsdialog: boolean;
}

interface IVedlegg {
  skjemaNummer: string;
  navn: string;
  status: string;
}

export type DPInnsynEndpoint = "soknad" | "paabegynte";

export async function getSoknader(
  request: Request,
  endpoint: DPInnsynEndpoint
): Promise<ISoknad[] | IPaabegynteSoknad[]> {
  const url = `${getEnv("DP_INNSYN_URL")}/${endpoint}`;
  const onBehalfOfToken = await getDPInnsynOboToken(request);

  console.log(`🔥 ${endpoint} url :`, url);
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${onBehalfOfToken}`,
    },
  });

  return response.json();
}
