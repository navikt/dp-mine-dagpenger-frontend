import { useRouteLoaderData } from "react-router";

import type { loader as rootLoader } from "~/root";

type Loaders = {
  root: typeof rootLoader;
};

export function useTypedRouteLoaderData<T extends keyof Loaders>(route: T) {
  const routeData = useRouteLoaderData<Loaders[T]>(route);

  if (!routeData) {
    throw new Error(
      `Rute (${route}) data er ikke lastet. Du prøver kanskje å få tilgang til data fra en underrute som ikke er lastet ennå`
    );
  }

  return routeData;
}
