import { subWeeks } from "date-fns";
import { describe, expect, test } from "vitest";
import type { ISoknad } from "~/models/getFullfortSoknader.server";
import { getSoknadWithinLast12Weeks } from "./soknad.utils";

describe("Filter soknad within last 12 weeks", () => {
  test("Expect filtered søknader to 3 soknader", () => {
    const filteredSokander = getSoknadWithinLast12Weeks(soknaderList);
    expect(filteredSokander).toHaveLength(3);
  });
});

export const soknaderList: ISoknad[] = [
  {
    journalpostId: "637599120",
    søknadsType: "NySøknad",
    kanal: "Digital",
    datoInnsendt: subWeeks(new Date(), 5).toDateString(),
    søknadId: "941a4929-8598-48b4-a482-5af3cb12c7d6",
    erNySøknadsdialog: true,
    endreLenke:
      "https://arbeid.intern.dev.nav.no/dagpenger/dialog/soknad/941a4929-8598-48b4-a482-5af3cb12c7d6/kvittering",
    skjemaKode: "NAV 04-01.03",
    tittel: "Søknad om dagpenger (ikke permittert)",
    vedlegg: [],
  },
  {
    journalpostId: "637598588",
    søknadsType: "NySøknad",
    kanal: "Digital",
    datoInnsendt: subWeeks(new Date(), 5).toDateString(),
    søknadId: "5ba8636a-9146-404e-bca3-6f451ec59204",
    erNySøknadsdialog: true,
    endreLenke:
      "https://arbeid.intern.dev.nav.no/dagpenger/dialog/soknad/5ba8636a-9146-404e-bca3-6f451ec59204/kvittering",
    skjemaKode: "NAV 04-01.03",
    tittel: "Søknad om dagpenger (ikke permittert)",
    vedlegg: [],
  },
  {
    journalpostId: "637598554",
    søknadsType: "NySøknad",
    kanal: "Digital",
    datoInnsendt: subWeeks(new Date(), 5).toDateString(),
    søknadId: "2defd3a1-3a85-4777-8378-a8269603f706",
    erNySøknadsdialog: true,
    endreLenke:
      "https://arbeid.intern.dev.nav.no/dagpenger/dialog/soknad/2defd3a1-3a85-4777-8378-a8269603f706/kvittering",
    skjemaKode: "NAV 04-01.03",
    tittel: "Søknad om dagpenger (ikke permittert)",
    vedlegg: [],
  },
  {
    journalpostId: "620063196",
    søknadsType: "NySøknad",
    kanal: "Digital",
    datoInnsendt: subWeeks(new Date(), 13).toDateString(),
    søknadId: "07b8b31c-ba5e-4574-8d98-979c94b606da",
    erNySøknadsdialog: true,
    endreLenke:
      "https://arbeid.intern.dev.nav.no/dagpenger/dialog/soknad/07b8b31c-ba5e-4574-8d98-979c94b606da/kvittering",
    skjemaKode: "NAV 04-01.03",
    tittel: "Søknad om dagpenger (ikke permittert)",
    vedlegg: [],
  },
];
