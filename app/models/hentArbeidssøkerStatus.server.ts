import { getPAWArbeidssokerregistreringOboToken } from "~/utils/auth.utils.server";
import { getEnv } from "~/utils/env.utils";
import { logger } from "~/utils/logger.utils";

type BrukerTypeResponse = "UKJENT_VERDI" | "UDEFINERT" | "VEILEDER" | "SYSTEM" | "SLUTTBRUKER";
export type ArbeidssøkerStatus = "IKKE_REGISTRERT" | "REGISTRERT" | "FEIL";

type ArbeidssøkkerMetaResponse = {
  tidspunkt: string;
  utfoertAv: { type: BrukerTypeResponse };
  kilde: string;
  aarsak: string;
};

export type Arbeidssøkerperioder = {
  periodeId: string;
  startet: ArbeidssøkkerMetaResponse;
  avsluttet: ArbeidssøkkerMetaResponse | null;
};

export async function hentArbeidssøkerStatus(request: Request): Promise<ArbeidssøkerStatus> {
  const url = `${getEnv("PAW_ARBEIDSSOEKERREGISTERET_URL")}/api/v1/arbeidssoekerperioder`;

  try {
    const onBehalfOfToken = await getPAWArbeidssokerregistreringOboToken(request);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${onBehalfOfToken}`,
      },
    });

    if (!response.ok) {
      return "FEIL";
    }

    const perioder: Arbeidssøkerperioder[] = await response.json();
    return perioder.some((periode) => periode.avsluttet === null) ? "REGISTRERT" : "IKKE_REGISTRERT";
  } catch (error) {
    logger.error(`Feil ved henting av arbeidssøkerstatus: ${error}`);

    return "FEIL";
  }
}
