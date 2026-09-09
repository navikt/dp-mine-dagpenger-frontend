import { addWeeks, isBefore } from "date-fns";
import { ISoknad } from "~/models/hentSøknader.server";

export function hentSøknaderSiste12Uker(søknader: ISoknad[]): ISoknad[] {
  return søknader?.filter((søknad) => {
    return isBefore(new Date(), addWeeks(new Date(søknad.innsendtTimestamp), 12));
  });
}

export function sorterOgFiltrerSøknader(soknader: ISoknad[]): ISoknad[] {
  // Sortere nyeste først basert på oppdatertTidspunkt
  // Filtrere ut søknader som er slettet av systemet
  return soknader
    .sort(
      (a, b) => new Date(b.oppdatertTidspunkt).getTime() - new Date(a.oppdatertTidspunkt).getTime()
    )
    .filter((soknad) => soknad.status !== "SLETTET_AV_SYSTEMET");
}
