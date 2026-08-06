import { addWeeks, isBefore } from "date-fns";
import { ISoknad } from "~/models/getSoknader.server";

export function getSoknadWithinLast12WeeksOrkestrator(soknader: ISoknad[]): ISoknad[] {
  return soknader?.filter((soknad) => {
    const sendtDate: Date = new Date(soknad.innsendtTimestamp);
    const today: Date = new Date();
    const endDate: Date = addWeeks(sendtDate, 12);
    return isBefore(today, endDate);
  });
}
