import { getEnv } from "~/utils/env.utils";
import { INetworkResponse, getHeaders } from "~/utils/fetch.utils";

export async function getSoknader(onBehalfOfToken: string): Promise<INetworkResponse> {
  const url = `${getEnv("DP_INNSYN_URL")}/soknad`;

  const response = await fetch(url, {
    method: "POST",
    headers: getHeaders(onBehalfOfToken),
  });

  if (!response.ok) {
    return {
      status: "error",
      error: {
        statusCode: response.status,
        statusText: "Det har skjedd en feil ved lagring av aktivitet, prøv igjen.",
      },
    };
  }

  return { status: "success" };
}
