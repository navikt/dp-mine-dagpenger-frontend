import type { INetworkResponse } from "~/models/networkResponse";
import type { ISoknad } from "~/models/getSoknader.server";

export function skalViseSaksbehandlingstid(
  aktivDagpengerett: INetworkResponse<boolean>
): boolean {
  return aktivDagpengerett.status !== "success" || !aktivDagpengerett.data;
}

export function filtrerSoknaderTilVisning(
  soknader: ISoknad[],
  nyesteSøknad: ISoknad | null,
  visSaksbehandlingstid: boolean
): ISoknad[] {
  if (!nyesteSøknad || !visSaksbehandlingstid) {
    return soknader;
  }

  return soknader.filter((soknad) => soknad.søknadId !== nyesteSøknad.søknadId);
}
