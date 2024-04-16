import { getEnv } from "~/utils/env.utils";
import { getHeaders } from "~/utils/fetch.utils";

export async function getPaabegynteSoknader(onBehalfOfToken: string): Promise<any> {
  const url = `${getEnv("DP_INNSYN_URL")}/paabegynte`;

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

  return await response.json();
}
