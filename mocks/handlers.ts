import { HttpResponse, bypass, http } from "msw";
import { soknaderResolver } from "./api-routes/soknaderResponse";
import { getEnv } from "~/utils/env.utils";
import { paabegynteSoknaderResolver } from "./api-routes/paabegyntSoknaderResponse";

export const handlers = [
  http.get(`${getEnv("DP_INNSYN_URL")}/soknad`, () => {
    return HttpResponse.json(soknaderResolver);
  }),

  http.get(`${getEnv("DP_INNSYN_URL")}/paabegynte`, () => {
    return HttpResponse.json(paabegynteSoknaderResolver);
  }),

  http.get("https://rt6o382n.apicdn.sanity.io/*", async ({ request }) => {
    // Bypassing mocks, use actual data instead
    const response = await fetch(bypass(request));
    const sanityTexts = await response.json();
    return HttpResponse.json(sanityTexts);
  }),
];
