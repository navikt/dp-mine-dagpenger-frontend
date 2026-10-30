import { getEnv } from "~/utils/env.utils";
import { getMeldekortRegisterToken } from "~/utils/auth.utils.server";
import { logger } from "~/utils/logger.utils";
import type { INetworkResponse } from "~/models/networkResponse";

export interface MeldekortStatus {
  harInnsendteMeldekort: boolean;
  meldekortTilUtfylling: MeldekortTilUtfylling[];
  redirectUrl: string | null;
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
      signal: AbortSignal.timeout(3_000),
      headers: {
        Authorization: `Bearer ${onBehalfOfToken}`,
      },
    });

    if (response.status === 204) {
      logger.info("Ingen meldekort tilgjengelig");
      return {
        status: "success",
        data: {
          harInnsendteMeldekort: false,
          meldekortTilUtfylling: [],
          redirectUrl: null,
        },
      };
    }
    if (!response.ok) {
      logger.error({
        message: "Feil ved henting av meldekort",
        statusCode: response.status,
      });
      return {
        status: "error",
        error: {
          statusCode: response.status,
          statusText: "Feil ved henting av meldekort",
        },
      };
    }

    const data: MeldekortStatus = await response.json();
    logger.info({
      message: "Meldekortstatus hentet",
      harInnsendteMeldekort: data.harInnsendteMeldekort,
      antallMeldekortTilUtfylling: data.meldekortTilUtfylling.length,
      harRedirectUrl: Boolean(data.redirectUrl),
    });

    return {
      status: "success",
      data,
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
