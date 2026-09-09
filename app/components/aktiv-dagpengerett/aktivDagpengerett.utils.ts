import type { INetworkResponse } from "~/models/networkResponse";

export function harAktivDagpengerRett(aktivDagpengerett: INetworkResponse<boolean>): boolean {
  return aktivDagpengerett.status === "success" && aktivDagpengerett.data === true;
}
