import { HttpResponse, bypass, http } from "msw";
import { getEnv } from "~/utils/env.utils";
import { paabegynteSoknaderResponse } from "./responses/paabegyntSoknaderResponse";
import { soknadResponse } from "./responses/soknaderResponse";

export const handlers = [
  http.get(`${getEnv("DP_INNSYN_URL")}/soknad`, () => {
    return HttpResponse.json(soknadResponse);
  }),

  http.get(`${getEnv("DP_INNSYN_URL")}/paabegynte`, () => {
    return HttpResponse.json(paabegynteSoknaderResponse);
  }),

  // Bypassing mocks, use actual data instead
  http.get("https://rt6o382n.apicdn.sanity.io/*", async ({ request }) => {
    const bypassResponse = await fetch(bypass(request));
    const response = await bypassResponse.json();

    return HttpResponse.json(response);
  }),
];
