import type { INetworkResponse } from "~/models/networkResponse";
import type { Søknad } from "~/models/getSoknader.server";

export function skalViseSaksbehandlingstid(
  aktivDagpengerett: INetworkResponse<boolean>
): boolean {
  return aktivDagpengerett.status !== "success" || !aktivDagpengerett.data;
}

export function filtrerSoknaderTilVisning(
  soknader: Søknad[],
  nyesteSøknad: Søknad | null,
  visSaksbehandlingstid: boolean
): Søknad[] {
  if (!nyesteSøknad || !visSaksbehandlingstid) {
    return soknader;
  }

  return soknader.filter((soknad) => soknad.søknadId !== nyesteSøknad.søknadId);
}
