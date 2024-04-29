import { useRouteLoaderData } from "@remix-run/react";
import type { loader as RootLoader } from "~/root";
import type { loader as indexLoader } from "~/routes/_index";

type Loaders = {
  root: typeof RootLoader;
  "routes/_index": typeof indexLoader;
};

export function useTypedRouteLoaderData<T extends keyof Loaders>(route: T) {
  const routeData = useRouteLoaderData<Loaders[T]>(route);

  console.log(`🔥 route :`, route);
  if (!routeData) {
    console.log(`route error :`, route);
    throw new Error(
      "Route data is not loaded. You might be trying to accessing data from a sub route that has not yet loaded"
    );
  }

  return routeData;
}
