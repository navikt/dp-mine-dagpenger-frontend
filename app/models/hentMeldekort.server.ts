import { getEnv } from "~/utils/env.utils";
import { getMeldekortRegisterToken } from "~/utils/auth.utils.server";
import { logger } from "~/utils/logger.utils";
import type { INetworkResponse } from "~/models/networkResponse";

export interface MeldekortStatus {
  harInnsendteMeldekort: boolean;
  meldekortTilUtfylling: MeldekortTilUtfylling[];
  redirectUrl: string;
}

export interface MeldekortTilUtfylling {
  fraOgMed: string;
  tilOgMed: string;
  uke: string;
  kanSendesFra: string;
  kanFyllesUtFra: string | null;
  fristForInnsending: string;
  etterregistrering: boolean;
}

export async function hentMeldekort(request: Request): Promise<INetworkResponse<MeldekortStatus>> {
  const url = `${getEnv("MELDEKORTREGISTER_URL")}/meldekortstatus`;
  try {
    const onBehalfOfToken = await getMeldekortRegisterToken(request);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${onBehalfOfToken}`,
      },
    });

    if (response.ok) {
      logger.error("Feil ved henting av meldekort");
      return {
        status: "error",
        error: {
          statusCode: response.status,
          statusText: "Feil ved henting av meldekort",
        },
      };
    }

    return {
      status: "success",
      data: await response.json(),
    };
  } catch (error) {
    logger.error(`Feil ved henting av meldekort: ${error}`);
    return {
      status: "error",
      error: {
        statusCode: 500,
        statusText: "Feil ved henting av meldekort",
      },
    };
  }
}
