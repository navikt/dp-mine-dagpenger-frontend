import { describe, expect, test } from "vitest";
import { formaterDato, norskKalenderdato } from "./dato.utils";

describe("norskKalenderdato", () => {
  test.each([
    ["2026-10-26T22:59:59Z", "2026-10-26"],
    ["2026-10-26T23:00:00Z", "2026-10-27"],
    ["2026-07-01T21:59:59Z", "2026-07-01"],
    ["2026-07-01T22:00:00Z", "2026-07-02"],
    ["2026-03-29T00:59:59Z", "2026-03-29"],
    ["2026-03-29T01:00:00Z", "2026-03-29"],
    ["2026-10-25T00:59:59Z", "2026-10-25"],
    ["2026-10-25T01:00:00Z", "2026-10-25"],
  ])("bruker norsk kalenderdato for %s", (tidspunkt, forventetDato) => {
    expect(norskKalenderdato(new Date(tidspunkt))).toBe(forventetDato);
  });
});

describe("formaterDato", () => {
  test.each([
    ["2026-11-09", "9. november 2026"],
    ["2026-07-02", "2. juli 2026"],
    ["2026-03-29", "29. mars 2026"],
    ["2026-10-25", "25. oktober 2026"],
    ["2026-11-08T23:00:00Z", "9. november 2026"],
    ["2026-07-01T22:00:00Z", "2. juli 2026"],
  ])("formaterer %s i Oslo-tid", (dato, forventetTekst) => {
    expect(formaterDato(dato)).toBe(forventetTekst);
  });

  test("støtter Date og egendefinert datoformat uten typeunntak", () => {
    expect(formaterDato(new Date("2026-11-08T23:00:00Z"), "yyyy-MM-dd HH:mm")).toBe(
      "2026-11-09 00:00"
    );
  });
});
