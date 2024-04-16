import { useRouteLoaderData } from "@remix-run/react";
import type { loader as RootLoader } from "~/root";

type Loaders = {
  root: typeof RootLoader;
};

export function useTypedRouteLoaderData<T extends keyof Loaders>(route: T) {
  const routeData = useRouteLoaderData<Loaders[T]>(route);

  if (!routeData) {
    throw new Error(
      "Route data is not loaded. You might be trying to accessing data from a sub route that has not yet loaded"
    );
  }

  return routeData;
}
