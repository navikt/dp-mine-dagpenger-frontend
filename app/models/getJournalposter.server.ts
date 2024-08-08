import { GraphQLClient, gql } from "graphql-request";
import { v4 as uuidv4 } from "uuid";
import { getSAFToken } from "~/utils/auth.utils.server";
import { getEnv } from "~/utils/env.utils";
import { parseIdportenToken } from "@navikt/oasis";
import { INetworkResponse } from "./networkResponse";

export async function getJournalposter(
  request: Request
): Promise<INetworkResponse<any["journalpost"]>> {
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
    const response = await client.request(journalpostQuery, { fnr });

    console.log(`🚀 response`, await client.request(journalpostQuery, { fnr }));

    return {
      status: "success",
      data: {},
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Feil ved henting av dokumenter";
    console.log(errorMessage);

    return {
      status: "error",
      error: {
        statusCode: 500,
        statusText: errorMessage,
      },
    };
  }
}

const journalpostQuery = gql`
  query dokumentoversiktSelvbetjening($fnr: String!) {
    dokumentoversiktSelvbetjening(ident: $fnr, tema: []) {
      tema {
        kode
        navn
      }
    }
  }
`;
