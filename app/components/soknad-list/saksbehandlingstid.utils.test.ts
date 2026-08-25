import { describe, expect, test } from "vitest";
import {
  filtrerSoknaderTilVisning,
  skalViseSaksbehandlingstid,
} from "./saksbehandlingstid.utils";
import type { ISoknad } from "~/models/getSoknader.server";

const soknader: ISoknad[] = [
  {
    søknadId: "nyeste",
    tittel: "Nyeste søknad",
    innsendtTimestamp: "2026-08-20T12:00:00Z",
    oppdatertTidspunkt: "2026-08-20T12:00:00Z",
    status: "INNSENDT",
    manglendeDokumentasjonskrav: [],
  },
  {
    søknadId: "eldre",
    tittel: "Eldre søknad",
    innsendtTimestamp: "2026-08-19T12:00:00Z",
    oppdatertTidspunkt: "2026-08-19T12:00:00Z",
    status: "INNSENDT",
    manglendeDokumentasjonskrav: [],
  },
];

describe("skalViseSaksbehandlingstid", () => {
  test("skal skjule saksbehandlingstid ved aktiv dagpengerett", () => {
    expect(skalViseSaksbehandlingstid({ status: "success", data: true })).toBe(false);
  });

  test("skal vise saksbehandlingstid uten aktiv dagpengerett", () => {
    expect(skalViseSaksbehandlingstid({ status: "success", data: false })).toBe(true);
  });

  test("skal vise saksbehandlingstid når oppslaget feiler", () => {
    expect(
      skalViseSaksbehandlingstid({
        status: "error",
        error: {
          statusCode: 500,
          statusText: "Klarte ikke hente aktiv dagpengerett",
        },
      })
    ).toBe(true);
  });

  test("skal ikke vise den nyeste søknaden to ganger når saksbehandlingstiden vises", () => {
    expect(filtrerSoknaderTilVisning(soknader, soknader[0], true)).toEqual([soknader[1]]);
  });

  test("skal vise den nyeste søknaden i listen når saksbehandlingstiden skjules", () => {
    expect(filtrerSoknaderTilVisning(soknader, soknader[0], false)).toEqual(soknader);
  });
});
