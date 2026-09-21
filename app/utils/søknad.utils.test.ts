import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import type { ISoknad } from "~/models/hentSøknader.server";
import {
  erSisteSøknadInnenforUker,
  filtrerSøknaderSiste12UkerOgSorterNyesteFørst,
  filtrerSøknaderTilVisning,
  hentFullførteSøknader,
  hentPåbegynteSøknad,
  hentSisteSøknad,
  skalViseSaksbehandlingstid,
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

describe("hentSisteSøknad", () => {
  test("returnerer første søknad", () => {
    const første = lagEnSøknad({ søknadId: "første" });

    expect(hentSisteSøknad([første, lagEnSøknad()])).toBe(første);
  });

  test("returnerer null når listen er tom", () => {
    expect(hentSisteSøknad([])).toBeNull();
  });
});

describe("erSisteSøknadInnenforUker", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-01-01T00:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("returnerer true når søknaden er innenfor perioden", () => {
    expect(erSisteSøknadInnenforUker(lagEnSøknad(), 9)).toBe(true);
  });

  test("returnerer false når søknaden mangler", () => {
    expect(erSisteSøknadInnenforUker(null, 9)).toBe(false);
  });
});

describe("skalViseSaksbehandlingstid", () => {
  test("viser saksbehandlingstid når aktiv dagpengerett mangler", () => {
    expect(skalViseSaksbehandlingstid({ status: "success", data: false })).toBe(true);
  });

  test("skjuler saksbehandlingstid ved aktiv dagpengerett", () => {
    expect(skalViseSaksbehandlingstid({ status: "success", data: true })).toBe(false);
  });

  test("viser saksbehandlingstid ved feil", () => {
    expect(
      skalViseSaksbehandlingstid({
        status: "error",
        error: { statusCode: 500, statusText: "Server error" },
      })
    ).toBe(true);
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
