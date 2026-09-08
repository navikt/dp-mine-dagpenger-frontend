import { addWeeks, isBefore } from "date-fns";
import type { Søknad } from "~/models/getSoknader.server";

export function hentSøknaderSiste12Uker(søknader: Søknad[]): Søknad[] {
  return søknader?.filter((soknad) => {
    return isBefore(new Date(), addWeeks(new Date(soknad.innsendtTimestamp), 12));
  });
}
