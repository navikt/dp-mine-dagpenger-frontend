import type { INetworkResponse } from "~/models/networkResponse";

export function hentBrukerHarAktivDagpengerRett(
  aktivDagpengerett: INetworkResponse<boolean>
): boolean {
  return aktivDagpengerett.status === "success" && aktivDagpengerett.data === true;
}
