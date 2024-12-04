import { HttpResponse, http, passthrough } from "msw";
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

  http.get("https://rt6o382n.apicdn.sanity.io/*", () => {
    return passthrough();
  }),

  http.get("https://dagpenger-unleash-api.nav.cloud.nais.io/*", () => {
    return passthrough();
  }),

  http.post("https://dagpenger-unleash-api.nav.cloud.nais.io/*", () => {
    return passthrough();
  }),

  http.get("https://dekoratoren.ekstern.dev.nav.no/*", () => {
    return passthrough();
  }),

  http.post("https://safselvbetjening-q1.dev-fss-pub.nais.io/graphql", () => {
    return passthrough();
  }),
];
