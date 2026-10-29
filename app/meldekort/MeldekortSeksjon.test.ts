import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import type { MeldekortTilUtfylling } from "~/models/hentMeldekort.server";
import type { RootLoaderType } from "~/root";
import MeldekortSeksjon from "./MeldekortSeksjon";

let loaderData: Pick<RootLoaderType, "meldekort" | "aktivDagpengerett" | "dagensDatoNorge">;

vi.mock("~/hooks/useTypedRouteLoaderData", () => ({
  useTypedRouteLoaderData: () => loaderData,
}));

vi.mock("~/hooks/useSanity", () => ({
  useSanity: () => ({
    getAppText: (textId: string) => textId,
    getLink: (linkId: string) => ({ linkText: linkId }),
  }),
}));

function lagMeldekort(kanSendesFra: string): MeldekortTilUtfylling {
  return {
    fraOgMed: "2026-10-12",
    tilOgMed: "2026-10-25",
    uke: "42-43",
    kanSendesFra,
    kanFyllesUtFra: null,
    fristForInnsending: "2026-11-02",
    etterregistrering: false,
  };
}

function renderSeksjon() {
  return renderToStaticMarkup(createElement(MeldekortSeksjon));
}

describe("MeldekortSeksjon", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 9, 27, 12));
    loaderData = {
      dagensDatoNorge: "2026-10-27",
      aktivDagpengerett: { status: "success", data: false },
      meldekort: {
        status: "success",
        data: {
          harInnsendteMeldekort: false,
          meldekortTilUtfylling: [],
          redirectUrl: "https://www.nav.no/meldekort",
        },
      },
    };
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test.each([401, 500])("rendrer ikke seksjonen ved HTTP %i", (statusCode) => {
    loaderData.meldekort = {
      status: "error",
      error: { statusCode, statusText: "Feil ved henting av meldekort" },
    };

    expect(renderSeksjon()).toBe("");
  });

  test.each(["2026-10-26", "2026-10-27"])(
    "viser send-knapp og varsel når kortet kan sendes fra %s",
    (dato) => {
      if (loaderData.meldekort.status !== "success") throw new Error("Ugyldige testdata");
      loaderData.meldekort.data.meldekortTilUtfylling = [lagMeldekort(dato)];

      const html = renderSeksjon();

      expect(html).toContain("meldekort.klar-til-innsending");
      expect(html).toContain('href="https://www.nav.no/meldekort"');
      expect(html).toContain("meldekort.send");
      expect(html).not.toContain("meldekort.neste-klar-til-innsending");
    }
  );

  test.each([null, "", "   "])("viser ikke send-varsel eller knapp uten URL (%s)", (url) => {
    if (loaderData.meldekort.status !== "success") throw new Error("Ugyldige testdata");
    loaderData.meldekort.data.redirectUrl = url;
    loaderData.meldekort.data.meldekortTilUtfylling = [
      lagMeldekort("2026-10-27"),
      lagMeldekort("2026-11-09"),
    ];

    const html = renderSeksjon();

    expect(html).not.toContain("meldekort.klar-til-innsending");
    expect(html).not.toContain("meldekort.send");
    expect(html).not.toContain("meldekort.neste-klar-til-innsending");
  });

  test("viser den tidligste framtidige datoen uten send-knapp", () => {
    if (loaderData.meldekort.status !== "success") throw new Error("Ugyldige testdata");
    loaderData.meldekort.data.meldekortTilUtfylling = [
      lagMeldekort("2026-11-23"),
      lagMeldekort("2026-11-09"),
    ];

    const html = renderSeksjon();

    expect(html).toContain("meldekort.neste-klar-til-innsending");
    expect(html).toContain("9. november 2026");
    expect(html).not.toContain("meldekort.send");
    expect(html).not.toContain("meldekort.klar-til-innsending");
  });

  test("bruker loaderens norske dato selv om klientklokken er på neste dag", () => {
    if (loaderData.meldekort.status !== "success") throw new Error("Ugyldige testdata");
    loaderData.meldekort.data.meldekortTilUtfylling = [lagMeldekort("2026-10-28")];
    const serverHtml = renderSeksjon();

    vi.setSystemTime(new Date("2026-10-28T00:01:00+01:00"));

    expect(renderSeksjon()).toBe(serverHtml);
    expect(serverHtml).toContain("meldekort.neste-klar-til-innsending");
    expect(serverHtml).toContain("28. oktober 2026");
    expect(serverHtml).not.toContain("meldekort.send");
  });

  test("viser send-knapp på norsk dato selv om klientklokken er på forrige dag", () => {
    if (loaderData.meldekort.status !== "success") throw new Error("Ugyldige testdata");
    loaderData.meldekort.data.meldekortTilUtfylling = [lagMeldekort("2026-10-27")];
    vi.setSystemTime(new Date("2026-10-26T23:01:00Z"));

    const html = renderSeksjon();

    expect(html).toContain("meldekort.klar-til-innsending");
    expect(html).toContain('href="https://www.nav.no/meldekort"');
  });

  test.each([false, true])(
    "viser bare informasjon når listen er tom og harInnsendteMeldekort er %s",
    (harInnsendteMeldekort) => {
      if (loaderData.meldekort.status !== "success") throw new Error("Ugyldige testdata");
      loaderData.meldekort.data.harInnsendteMeldekort = harInnsendteMeldekort;

      const html = renderSeksjon();

      expect(html).toContain("meldekort.tittel");
      expect(html).toContain("meldekort.tekst-Innhold-1");
      expect(html).not.toContain("meldekort.send");
      expect(html).not.toContain("meldekort.se-og-endre");
      expect(html).not.toContain("meldekort.klar-til-innsending");
      expect(html).not.toContain("meldekort.neste-klar-til-innsending");
    }
  );

  test("viser kort tekst ved aktiv dagpengerett", () => {
    loaderData.aktivDagpengerett = { status: "success", data: true };

    const html = renderSeksjon();

    expect(html).toContain("meldekort.tekstinnhold-2");
    expect(html).not.toContain("meldekort.tekst-Innhold-1");
  });
});
