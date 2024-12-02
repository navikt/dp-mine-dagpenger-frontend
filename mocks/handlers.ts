import { HttpResponse, bypass, http, passthrough } from "msw";
import { getEnv } from "~/utils/env.utils";
import { arbeidssoekerPerioderResponse } from "./responses/arbeidssoekerPerioderResponse";
import { paabegynteSoknaderResponse } from "./responses/paabegyntSoknaderResponse";
import { soknadResponse } from "./responses/soknaderResponse";

export const handlers = [
  http.get(`${getEnv("DP_INNSYN_URL")}/soknad`, () => {
    return HttpResponse.json(soknadResponse);
  }),

  http.get(`${getEnv("DP_INNSYN_URL")}/paabegynte`, () => {
    return HttpResponse.json(paabegynteSoknaderResponse);
  }),

  http.get(`${getEnv("OKONOMI_KONTOREGISTER_URL")}/api/borger/v1/hent-aktiv-konto`, () => {
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

  http.get("https://dagpenger-unleash-api.nav.cloud.nais.io/*", ({ request }) => {
    if (request.headers.has("x-my-header")) {
      return passthrough();
    }

    return HttpResponse.text("Mocked response");
  }),
];
