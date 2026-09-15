import { addWeeks, isBefore } from "date-fns";
import { ISoknad } from "~/models/hentSøknader.server";

export function filtrerSøknadSiste12Uker(soknader: ISoknad[]): ISoknad[] {
  return soknader?.filter((soknad) => {
    const sendtDate: Date = new Date(soknad.innsendtTimestamp);
    const today: Date = new Date();
    const endDate: Date = addWeeks(sendtDate, 12);
    return isBefore(today, endDate);
  });
}

export function sorterNyesteSøknaderFørst(soknader: ISoknad[]): ISoknad[] {
  return [...soknader].sort((a, b) => {
    const dateA = new Date(a.innsendtTimestamp);
    const dateB = new Date(b.innsendtTimestamp);
    return dateB.getTime() - dateA.getTime();
  });
}

export function filtrerFullforteSøknader(soknader: ISoknad[]): ISoknad[] {
  return soknader.filter(
    (soknad) => soknad.status === "INNSENDT" || soknad.status === "JOURNALFØRT"
  );
}

export function finnPåbegyntSøknad(soknader: ISoknad[]): ISoknad | undefined {
  return soknader.find((soknad) => soknad.status === "PÅBEGYNT");
}

export function filtrerBortSlettedeSøknader(soknader: ISoknad[]): ISoknad[] {
  return soknader.filter((soknad) => soknad.status !== "SLETTET_AV_SYSTEMET");
}
