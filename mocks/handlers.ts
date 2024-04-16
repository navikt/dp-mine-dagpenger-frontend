import { HttpResponse, http } from "msw";
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

  http.get("https://rt6o382n.apicdn.sanity.io/v2021-06-06/data/query/production", () => {
    return HttpResponse.json({});
  }),
];
