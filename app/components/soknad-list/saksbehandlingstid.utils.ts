import { isAfter, subWeeks } from "date-fns";
import type { INetworkResponse } from "~/models/networkResponse";
import type { ISoknad } from "~/models/hentSøknader.server";

export function skalViseSaksbehandlingstid(aktivDagpengerett: INetworkResponse<boolean>): boolean {
  return aktivDagpengerett.status !== "success" || !aktivDagpengerett.data;
}

export function finnNyesteSøknadHvisInnenforSaksbehandlingsfrist(
  søknader: ISoknad[],
  estimertSaksbehandlingstid: number
): ISoknad | null {
  const [nyesteSøknad] = søknader;
  if (!nyesteSøknad) {
    return null;
  }

  const nyesteInnsendtTidspunkt = new Date(nyesteSøknad.innsendtTimestamp);
  const frist = subWeeks(new Date(), estimertSaksbehandlingstid + 2);

  return isAfter(nyesteInnsendtTidspunkt, frist) ? nyesteSøknad : null;
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
