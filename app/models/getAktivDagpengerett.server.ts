import { getDPInnsynOboToken } from "~/utils/auth.utils.server";
import { getEnv } from "~/utils/env.utils";
import { logger } from "~/utils/logger.utils";
import type { INetworkResponse } from "./networkResponse";

interface IAktivDagpengerettResponse {
  harAktivDagpengerett: boolean;
}

export async function getHarAktivDagpengerett(
  request: Request
): Promise<INetworkResponse<boolean>> {
  try {
    const onBehalfOfToken = await getDPInnsynOboToken(request);
    const response = await fetch(`${getEnv("DP_INNSYN_URL")}/aktiv-dagpenger`, {
      headers: {
        Authorization: `Bearer ${onBehalfOfToken}`,
      },
      signal: AbortSignal.timeout(3_000),
    });

    if (!response.ok) {
      logger.error({
        message: "Feil ved uthenting av aktiv dagpengerett",
        statusCode: response.status,
      });
      return {
        status: "error",
        error: {
          statusCode: response.status,
          statusText: "Klarte ikke hente aktiv dagpengerett",
        },
      };
    }

    const data: IAktivDagpengerettResponse = await response.json();
    return { status: "success", data: data.harAktivDagpengerett };
  } catch (error: unknown) {
    logger.error({
      message: "Feil ved uthenting av aktiv dagpengerett",
      errorType: error instanceof Error ? error.name : "Ukjent feil",
    });
    return {
      status: "error",
      error: {
        statusCode: 500,
        statusText: "Klarte ikke hente aktiv dagpengerett",
      },
    };
  }
}
