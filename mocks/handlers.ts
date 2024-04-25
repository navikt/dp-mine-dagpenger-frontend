import { HttpResponse, bypass, http } from "msw";
import { getEnv } from "~/utils/env.utils";
import { paabegynteSoknaderResponse } from "./responses/paabegyntSoknaderResponse";
import { soknadResponse } from "./responses/soknaderResponse";
import { arbeidssoekerPerioderResponse } from "./responses/arbeidssoekerPerioderResponse";

export const handlers = [
  http.get(`${getEnv("DP_INNSYN_URL")}/soknad`, () => {
    return HttpResponse.json(soknadResponse);
  }),

  http.get(`${getEnv("DP_INNSYN_URL")}/paabegynte`, () => {
    return HttpResponse.json(paabegynteSoknaderResponse);
  }),

  http.get(`${getEnv("OKONOMI_KONTOREGISTER_URL")}/api/borger/v1`, () => {
    return HttpResponse.json({
      kontonummer: "12345678901",
    });
  }),

  http.get(`${getEnv("PAW_ARBEIDSSOEKERREGISTERET_URL")}/api/v1/arbeidssoekerperioder`, () => {
    return HttpResponse.json(arbeidssoekerPerioderResponse);
  }),

  // Bypassing mocks, use actual data instead
  http.get("https://rt6o382n.apicdn.sanity.io/*", async ({ request }) => {
    const bypassResponse = await fetch(bypass(request));
    const response = await bypassResponse.json();

    return HttpResponse.json(response);
  }),
];
