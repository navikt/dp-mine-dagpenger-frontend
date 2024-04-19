import { getPAWArbeidssokerregistreringOboToken } from "~/utils/auth.utils.server";
import { getEnv } from "~/utils/env.utils";

export type IArbeidssokerStatus = "UNREGISTERED" | "REGISTERED" | "ERROR";
type brukerTypeResponse = "UKJENT_VERDI" | "UDEFINERT" | "VEILEDER" | "SYSTEM" | "SLUTTBRUKER";

export interface IArbeidssokerperioder {
  periodeId: string;
  startet: IArbeidssoekkerMetaResponse;
  avsluttet: IArbeidssoekkerMetaResponse | null;
}

interface IArbeidssoekkerMetaResponse {
  tidspunkt: string;
  utfoertAv: { type: brukerTypeResponse };
  kilde: string;
  aarsak: string;
}

export async function getArbeidssoekerPerioder(request: Request): Promise<IArbeidssokerperioder[]> {
  const url = `${getEnv("PAW_ARBEIDSSOEKERREGISTERET_URL")}/api/v1/arbeidssoekerperioder`;

  const onBehalfOfToken = await getPAWArbeidssokerregistreringOboToken(request);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${onBehalfOfToken}`,
    },
  });

  return response.json();
}
