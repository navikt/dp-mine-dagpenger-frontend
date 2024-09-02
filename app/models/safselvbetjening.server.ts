import { parseIdportenToken } from "@navikt/oasis";
import { GraphQLClient } from "graphql-request";
import { Journalpost } from "graphql/generated/saf/graphql";
import { v4 as uuidv4 } from "uuid";
import { getSAFToken } from "~/utils/auth.utils.server";
import { getEnv } from "~/utils/env.utils";
import {
  berikAvsenderEllerMottaker,
  berikBrukerDokumentTilgang,
  berikDokumentMedType,
  finnOgSettOpprettetDato,
  graphqlQuery,
  IJournalpost,
  IUtvidedJournalpost,
} from "~/utils/safselvbetjening.utils";
import { INetworkResponse } from "./networkResponse";

export async function getJournalposter(
  request: Request
): Promise<INetworkResponse<IJournalpost[]>> {
  const onBehalfOfToken = await getSAFToken(request);

  const parsedToken = parseIdportenToken(onBehalfOfToken);

  if (!parsedToken.ok) {
    throw Error("Klarte ikke hente parseIdportenToken");
  }

  const fnr = parsedToken.pid;
  const callId = uuidv4();

  const url = `${getEnv("SAF_URL")}/graphql`;

  const client = new GraphQLClient(url, {
    headers: {
      Authorization: `Bearer ${onBehalfOfToken}`,
      "Nav-User-Id": fnr,
      "Nav-Consumer-Id": "dp-mine-dagpenger-frontend",
    },
  });

  try {
    console.log(`Henter dokumenter med call-id: ${callId}`);
    const response = await client.request(graphqlQuery, { fnr });

    const journalposterResponse: Journalpost[] =
      response.dokumentoversiktSelvbetjening.journalposter;

    const journalposter = journalposterResponse
      .map(finnOgSettOpprettetDato)
      .map((journalpost: IUtvidedJournalpost) => berikAvsenderEllerMottaker(journalpost, fnr))
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

    return {
      status: "error",
      error: {
        statusCode: 500,
        statusText: errorMessage,
      },
    };
  }
}
