import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import type { ISoknad } from "~/models/hentSøknader.server";
import {
  filtrerSøknaderSiste12UkerOgSorterNyesteFørst,
  filtrerSøknaderTilVisning,
  hentFullførteSøknader,
  hentPåbegynteSøknad,
} from "./søknad.utils";

function lagEnSøknad(overrides: Partial<ISoknad> = {}): ISoknad {
  return {
    søknadId: "søknad-1",
    tittel: "Søknad om dagpenger",
    innsendtTimestamp: "2024-12-01T12:00:00.000Z",
    oppdatertTidspunkt: "2024-12-01T12:00:00.000Z",
    status: "INNSENDT",
    manglendeDokumentasjonskrav: [],
    ...overrides,
  };
}

describe("filtrerSøknaderSiste12UkerOgSorterNyesteFørst", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-01-01T00:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("filtrerer bort slettede og søknader eldre enn 12 uker, og sorterer nyeste først", () => {
    const nyest = lagEnSøknad({
      søknadId: "nyest",
      innsendtTimestamp: "2024-12-20T12:00:00.000Z",
    });
    const eldst = lagEnSøknad({
      søknadId: "eldst",
      innsendtTimestamp: "2024-11-15T12:00:00.000Z",
    });
    const slettet = lagEnSøknad({ søknadId: "slettet", status: "SLETTET_AV_SYSTEMET" });
    const forGammel = lagEnSøknad({
      søknadId: "for-gammel",
      innsendtTimestamp: "2024-10-01T12:00:00.000Z",
    });

    expect(
      filtrerSøknaderSiste12UkerOgSorterNyesteFørst([eldst, forGammel, slettet, nyest])
    ).toEqual([nyest, eldst]);
  });
});

describe("hentFullførteSøknader", () => {
  test("returnerer innsendte og journalførte søknader", () => {
    const innsendt = lagEnSøknad({ søknadId: "innsendt", status: "INNSENDT" });
    const journalført = lagEnSøknad({ søknadId: "journalført", status: "JOURNALFØRT" });
    const påbegynt = lagEnSøknad({ søknadId: "påbegynt", status: "PÅBEGYNT" });

    expect(hentFullførteSøknader([innsendt, påbegynt, journalført])).toEqual([
      innsendt,
      journalført,
    ]);
  });
});

describe("hentPåbegynteSøknad", () => {
  test("returnerer den påbegynte søknaden", () => {
    const påbegynt = lagEnSøknad({ søknadId: "påbegynt", status: "PÅBEGYNT" });

    expect(hentPåbegynteSøknad([lagEnSøknad(), påbegynt])).toBe(påbegynt);
  });

  test("returnerer undefined når det ikke finnes en påbegynt søknad", () => {
    expect(hentPåbegynteSøknad([lagEnSøknad()])).toBeUndefined();
  });
});

describe("filtrerSøknaderTilVisning", () => {
  test("returnerer alle søknader når ingen søknad skal fremheves", () => {
    const søknader = [lagEnSøknad()];

    expect(filtrerSøknaderTilVisning(søknader, false)).toBe(søknader);
  });

  test("filtrerer bort den første søknaden når en annen skal fremheves", () => {
    const første = lagEnSøknad({ søknadId: "første" });
    const andre = lagEnSøknad({ søknadId: "andre" });

    expect(filtrerSøknaderTilVisning([første, andre], true)).toEqual([andre]);
  });
});
