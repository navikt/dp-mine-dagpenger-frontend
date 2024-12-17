import { parseIdportenToken } from "@navikt/oasis";
import { GraphQLClient } from "graphql-request";
import { getSAFToken } from "~/utils/auth.utils.server";
import { getEnv } from "~/utils/env.utils";
import {
  berikAvsenderEllerMottaker,
  berikBrukerDokumentTilgang,
  berikDokumentMedType,
  graphqlQuery,
  IJournalpost,
  settDatoOpprettet,
} from "~/utils/safJournalposter.utils";
import { INetworkResponse } from "./networkResponse";
import { logger } from "~/utils/logger.utils";

export async function getSAFJournalposter(
  request: Request
): Promise<INetworkResponse<IJournalpost[]>> {
  const onBehalfOfToken = await getSAFToken(request);

  const parsedToken = parseIdportenToken(onBehalfOfToken);

  if (!parsedToken.ok) {
    logger.error("Klarte ikke hente parseIdportenToken");
    throw Error("Klarte ikke hente parseIdportenToken");
  }

  const fnr = parsedToken.pid;

  const url = `${getEnv("SAF_URL")}/graphql`;

  const client = new GraphQLClient(url, {
    headers: {
      Authorization: `Bearer ${onBehalfOfToken}`,
      "Nav-User-Id": fnr,
      "Nav-Consumer-Id": "dp-mine-dagpenger-frontend",
    },
  });

  try {
    const response = await client.request(graphqlQuery, { fnr });

    const journalposterResponse = response.dokumentoversiktSelvbetjening
      .journalposter as IJournalpost[];

    const journalposter = journalposterResponse
      .map(settDatoOpprettet)
      .map((journalpost: IJournalpost) => berikAvsenderEllerMottaker(journalpost, fnr))
      .map(({ journalpostId, dokumenter, ...rest }): IJournalpost => {
        return {
          journalpostId,
          dokumenter: dokumenter?.map(berikDokumentMedType).map(berikBrukerDokumentTilgang),
          ...rest,
        };
      });

    return {
      status: "success",
      data: journalposter,
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Feil ved henting av dokumenter";

    logger.error(errorMessage);
    return {
      status: "error",
      error: {
        statusCode: 500,
        statusText: errorMessage,
      },
    };
  }
}
