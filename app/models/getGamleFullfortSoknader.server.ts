import type { INetworkResponse } from "~/models/networkResponse";

export interface IGamleSoknad {
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

export async function getGamleFullforteSoknader(
): Promise<INetworkResponse<IGamleSoknad[]>> {

  return {
    status: "success",
    data: [] as IGamleSoknad[],
  };
}
