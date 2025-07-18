import { getPAWArbeidssokerregistreringOboToken } from "~/utils/auth.utils.server";
import { getEnv } from "~/utils/env.utils";
import type { INetworkResponse } from "./networkResponse";
import { logger } from "~/utils/logger.utils";

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

export async function getArbeidssoekerPerioder(
  request: Request
): Promise<INetworkResponse<IArbeidssokerperioder[]>> {
  const url = `${getEnv("PAW_ARBEIDSSOEKERREGISTERET_URL")}/api/v1/arbeidssoekerperioder`;

  const onBehalfOfToken = await getPAWArbeidssokerregistreringOboToken(request);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${onBehalfOfToken}`,
    },
  });

  if (!response.ok) {
    logger.error("Feil ved uthenting av arbeidssøkerstatus");

    return {
      status: "error",
      error: {
        statusCode: response.status,
        statusText: "Feil ved uthenting av arbeidssøkerstatus",
      },
    };
  }

  const data: IArbeidssokerperioder[] = await response.json();

  return { status: "success", data };
}
