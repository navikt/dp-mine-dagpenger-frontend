import { addWeeks, isBefore } from "date-fns";
import type { IGamleSoknad } from "~/models/getGamleFullfortSoknader.server";
import { ISoknad } from "~/models/getSoknader.server";

export function getSoknadWithinLast12Weeks(soknader: IGamleSoknad[]): IGamleSoknad[] {
  return soknader?.filter((soknad) => {
    const sendtDate: Date = new Date(soknad.datoInnsendt);
    const today: Date = new Date();
    const endDate: Date = addWeeks(sendtDate, 12);
    return isBefore(today, endDate);
  });
}

export function getSoknadWithinLast12WeeksOrkestrator(soknader: ISoknad[]): ISoknad[] {
  return soknader?.filter((soknad) => {
    const sendtDate: Date = new Date(soknad.innsendtTimestamp);
    const today: Date = new Date();
    const endDate: Date = addWeeks(sendtDate, 12);
    return isBefore(today, endDate);
  });
}
