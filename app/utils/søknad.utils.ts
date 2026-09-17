import { addWeeks, isAfter, isBefore, subWeeks } from "date-fns";
import { ISoknad } from "~/models/hentSøknader.server";
import type { INetworkResponse } from "~/models/networkResponse";

export function filtrerSøknaderSiste12UkerOgSorterNyesteFørst(søknader: ISoknad[]): ISoknad[] {
  const idag: Date = new Date();

  return søknader
    .filter((søknad) => søknad.status !== "SLETTET_AV_SYSTEMET")
    .filter((søknad) => {
      const innsendtDato: Date = new Date(søknad.innsendtTimestamp);
      const tilDato: Date = addWeeks(innsendtDato, 12);
      return isBefore(idag, tilDato);
    })
    .sort((a, b) => {
      const datoA = new Date(a.innsendtTimestamp);
      const datoB = new Date(b.innsendtTimestamp);
      return datoB.getTime() - datoA.getTime();
    });
}

export function hentFullførteSøknader(søknader: ISoknad[]): ISoknad[] {
  return søknader.filter(
    (søknad) => søknad.status === "INNSENDT" || søknad.status === "JOURNALFØRT"
  );
}

export function hentPåbegynteSøknad(søknader: ISoknad[]): ISoknad | undefined {
  return søknader.find((søknad) => søknad.status === "PÅBEGYNT");
}

export function hentSisteSøknad(søknader: ISoknad[]): ISoknad | null {
  return søknader[0] ?? null;
}

export function erSisteSøknadInnenforUker(
  sisteSøknad: ISoknad | null,
  antallUker: number
): boolean {
  return (
    sisteSøknad !== null &&
    isAfter(new Date(sisteSøknad.innsendtTimestamp), subWeeks(new Date(), antallUker))
  );
}

export function skalViseSaksbehandlingstid(aktivDagpengerett: INetworkResponse<boolean>): boolean {
  return aktivDagpengerett.status === "error" || aktivDagpengerett.data === false;
}

export function filtrerSøknaderTilVisning(søknader: ISoknad[], fremheveSøknad: boolean): ISoknad[] {
  if (!fremheveSøknad) {
    return søknader;
  }

  return søknader.filter((søknad) => søknad.søknadId !== søknader[0].søknadId);
}
