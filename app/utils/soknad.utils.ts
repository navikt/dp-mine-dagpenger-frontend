import { addWeeks, isBefore } from "date-fns";
import { ISoknad } from "~/models/getFullfortSoknader.server";

export function withinLast12Weeks(soknader: ISoknad[]): ISoknad[] {
  return soknader?.filter((soknad) => {
    const sendtDate: Date = new Date(soknad.datoInnsendt);
    const today: Date = new Date();
    const endDate: Date = addWeeks(sendtDate, 12);
    return isBefore(today, endDate);
  });
}
