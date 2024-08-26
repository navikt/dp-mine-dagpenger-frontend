import { parseIdportenToken } from "@navikt/oasis";
import { GraphQLClient } from "graphql-request";
import { graphql } from "graphql/generated/saf";
import { DokumentoversiktSelvbetjeningQuery } from "graphql/generated/saf/graphql";
import { v4 as uuidv4 } from "uuid";
import { getSAFToken } from "~/utils/auth.utils.server";
import { getEnv } from "~/utils/env.utils";
import { INetworkResponse } from "./networkResponse";

export type DokumentoversiktSelvbetjening =
  DokumentoversiktSelvbetjeningQuery["dokumentoversiktSelvbetjening"];
export type Journalposter = DokumentoversiktSelvbetjening["journalposter"];

export interface JournalposterOpprettetDato extends Journalposter {
  datoOpprettet?: string | null;
}

export async function getJournalposter(request: Request): Promise<INetworkResponse<Journalposter>> {
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
    const response = await client.request(query, { fnr });

    return {
      status: "success",
      data: response.dokumentoversiktSelvbetjening.journalposter,
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Feil ved henting av dokumenter";
    // const errorCode = error instanceof Error ? error. : 500;

    console.log(`🔥 error :`, error);

    return {
      status: "error",
      error: {
        statusCode: 500,
        statusText: errorMessage,
      },
    };
  }
}

const query = graphql(`
  query dokumentoversiktSelvbetjening($fnr: String!) {
    dokumentoversiktSelvbetjening(ident: $fnr, tema: [DAG, OPP]) {
      journalposter {
        journalpostId
        tema
        tittel
        relevanteDatoer {
          dato
          datotype
        }
        avsender {
          id
          type
        }
        mottaker {
          id
          type
        }
        journalposttype
        journalstatus
        dokumenter {
          dokumentInfoId
          tittel
          dokumentvarianter {
            variantformat
            brukerHarTilgang
          }
        }
      }
    }
  }
`);
