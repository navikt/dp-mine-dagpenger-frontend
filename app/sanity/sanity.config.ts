import { getEnv } from "~/utils/env.utils";

export const sanityConfig = {
  dataset: getEnv("SANITY_DATASET"),
  projectId: "rt6o382n",
  useCdn: true,
  token: "",
  apiVersion: "2022-03-07",
};
