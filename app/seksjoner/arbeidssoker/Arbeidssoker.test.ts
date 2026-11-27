import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, expect, test, vi } from "vitest";
import type { ArbeidssøkerStatus } from "~/models/hentArbeidssøkerStatus.server";
import type { RootLoaderType } from "~/root";
import { Arbeidssoker } from "./Arbeidssoker";

let arbeidssøkerStatus: ArbeidssøkerStatus;
let aktivDagpengerett: RootLoaderType["aktivDagpengerett"];

vi.mock("~/hooks/useTypedRouteLoaderData", () => ({
  useTypedRouteLoaderData: () => ({ arbeidssøkerStatus, aktivDagpengerett }),
}));

vi.mock("~/hooks/useSanity", () => ({
  useSanity: () => ({
    getAppText: (textId: string) => textId,
    getRichText: (textId: string) => ({
      _type: "block",
      _key: textId,
      style: "normal",
      markDefs: textId === "arbeidssoker.beskrivelse.uten-dagpengerett"
        ? [{ _type: "link", _key: "lenke", href: "https://www.nav.no/arbeid/registrering" }]
        : [],
      children: [{
        _type: "span",
        _key: "tekst",
        text: textId,
        marks: textId === "arbeidssoker.beskrivelse.uten-dagpengerett" ? ["lenke"] : [],
      }],
    }),
  }),
}));

beforeEach(() => {
  arbeidssøkerStatus = "REGISTRERT";
  aktivDagpengerett = { status: "success", data: true };
});

test.each([
  { status: "REGISTRERT", tekst: "arbeidssoker.status.registrert" },
  { status: "IKKE_REGISTRERT", tekst: "arbeidssoker.status.ikke-registrert" },
] as const)("viser riktig statusmerke for $status", ({ status, tekst }) => {
  arbeidssøkerStatus = status;

  const html = renderToStaticMarkup(createElement(Arbeidssoker));

  expect(html).toMatch(/<h2[^>]*>arbeidssoker\.tittel<\/h2>/);
  expect(html).toContain("arbeidssoker.beskrivelse.med-dagpengerett");
  expect(html).toMatch(/<dt[^>]*>arbeidssoker\.din-status<\/dt>/);
  expect(html).toContain(tekst);
  expect(html).not.toContain("arbeidssokers-status.teknisk-feil");
});

test("viser feiltekst uten å fremstille ukjent status som ikke registrert", () => {
  arbeidssøkerStatus = "FEIL";

  const html = renderToStaticMarkup(createElement(Arbeidssoker));

  expect(html).toContain("arbeidssokers-status.teknisk-feil");
  expect(html).not.toContain("arbeidssoker.status.ikke-registrert");
  expect(html).not.toContain("arbeidssoker.status.registrert");
});

test("viser beskrivelsen med lenke når brukeren bekreftet mangler aktiv dagpengerett", () => {
  aktivDagpengerett = { status: "success", data: false };

  const html = renderToStaticMarkup(createElement(Arbeidssoker));

  expect(html).toContain("arbeidssoker.beskrivelse.uten-dagpengerett");
  expect(html).toContain('href="https://www.nav.no/arbeid/registrering"');
  expect(html).not.toContain("arbeidssoker.beskrivelse.med-dagpengerett");
});

test.each([
  { status: "success", data: true },
  { status: "error", error: { statusCode: 500, statusText: "Kunne ikke hente dagpengerett" } },
] as const)("viser beskrivelsen uten lenke ved dagpengerett-respons $status", (respons) => {
  aktivDagpengerett = respons;

  const html = renderToStaticMarkup(createElement(Arbeidssoker));

  expect(html).toContain("arbeidssoker.beskrivelse.med-dagpengerett");
  expect(html).not.toContain("arbeidssoker.beskrivelse.uten-dagpengerett");
  expect(html).not.toContain('href="https://www.nav.no/arbeid/registrering"');
});
