import type { ISoknad } from "~/models/hentSøknader.server";

const now = new Date().toISOString();

export const søknaderResponse: ISoknad[] = [
  {
    søknadId: "mock-innsendt-soknad",
    tittel: "Søknad om dagpenger",
    innsendtTimestamp: now,
    oppdatertTidspunkt: now,
    status: "INNSENDT",
    søknadVedtak: null,
    manglendeDokumentasjonskrav: [],
  },
  {
    søknadId: "mock-paabegynt-soknad",
    tittel: "Søknad om dagpenger",
    innsendtTimestamp: now,
    oppdatertTidspunkt: now,
    status: "PÅBEGYNT",
    søknadVedtak: null,
    manglendeDokumentasjonskrav: [],
  },
];
