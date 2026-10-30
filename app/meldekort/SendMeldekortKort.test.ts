import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, test, vi } from "vitest";
import type { RootLoaderType } from "~/root";
import type { MeldekortTilUtfylling } from "~/models/hentMeldekort.server";
import { PageHero } from "~/components/page-hero/PageHero";
import { SendMeldekortKort } from "./SendMeldekortKort";

let loaderData: Pick<RootLoaderType, "meldekort" | "aktivDagpengerett" | "dagensDatoNorge">;

vi.mock("~/hooks/useTypedRouteLoaderData", () => ({
  useTypedRouteLoaderData: () => loaderData,
}));

vi.mock("react-router", () => ({
  useRouteLoaderData: () => loaderData,
}));

vi.mock("~/hooks/useSanity", () => ({
  useSanity: () => ({
    getAppText: (key: string) =>
      key === "meldekort.frist-for-innsending" ? "Frist for innsending:" : key,
    getLink: () => ({ linkText: "Send meldekort" }),
  }),
}));

vi.mock("~/components/aktiv-dagpengerett/AktivDagpengerettAlert", () => ({
  AktivDagpengerettAlert: () => "dagpengerett-varsel",
}));

vi.mock("~/components/arbeidssoker-status/ArbeidssokerStatus", () => ({
  ArbeidssokerStatus: () => null,
}));

function lagMeldekort(kanSendesFra: string, fristForInnsending = "2026-11-02"): MeldekortTilUtfylling {
  return {
    fraOgMed: "2026-10-12",
    tilOgMed: "2026-10-25",
    uke: "42-43",
    kanSendesFra,
    kanFyllesUtFra: null,
    fristForInnsending,
    etterregistrering: false,
  };
}

function renderKort() {
  return renderToStaticMarkup(createElement(SendMeldekortKort));
}

describe("SendMeldekortKort", () => {
  beforeEach(() => {
    loaderData = {
      dagensDatoNorge: "2026-10-27",
      aktivDagpengerett: { status: "success", data: false },
      meldekort: {
        status: "success",
        data: {
          harInnsendteMeldekort: false,
          redirectUrl: " https://www.nav.no/meldekort ",
          meldekortTilUtfylling: [lagMeldekort("2026-10-27")],
        },
      },
    };
  });

  test.each(["2026-10-26", "2026-10-27"])(
    "viser warning-kort med frist og lenke for meldekort klart fra %s",
    (dato) => {
      if (loaderData.meldekort.status !== "success") throw new Error("Ugyldige testdata");
      loaderData.meldekort.data.meldekortTilUtfylling = [lagMeldekort(dato)];

      const html = renderKort();

      expect(html).toContain('data-color="warning"');
      expect(html).toContain('href="https://www.nav.no/meldekort"');
      expect(html).toContain("Send meldekort");
      expect(html).toContain("Frist for innsending:");
      expect(html).toContain("2. november 2026");
      expect(html).toContain("<svg");
      expect(html).toContain('aria-hidden="true"');
    }
  );

  test.each([null, "", "   "])("skjuler kortet uten redirectUrl (%s)", (url) => {
    if (loaderData.meldekort.status !== "success") throw new Error("Ugyldige testdata");
    loaderData.meldekort.data.redirectUrl = url;
    expect(renderKort()).toBe("");
  });

  test.each([{ kort: [] }, { kort: [lagMeldekort("2026-10-28")] }])(
    "skjuler kortet uten et klart meldekort (%j)",
    ({ kort }) => {
      if (loaderData.meldekort.status !== "success") throw new Error("Ugyldige testdata");
      loaderData.meldekort.data.meldekortTilUtfylling = kort;
      expect(renderKort()).toBe("");
    }
  );

  test("skjuler kortet ved feil fra registeret", () => {
    loaderData.meldekort = {
      status: "error",
      error: { statusCode: 500, statusText: "Feil" },
    };
    expect(renderKort()).toBe("");
  });

  test("viser fristen til det eldste klare meldekortet", () => {
    if (loaderData.meldekort.status !== "success") throw new Error("Ugyldige testdata");
    loaderData.meldekort.data.meldekortTilUtfylling = [
      lagMeldekort("2026-10-27", "2026-11-09"),
      lagMeldekort("2026-10-26"),
    ];
    expect(renderKort()).toContain("2. november 2026");
    expect(renderKort()).not.toContain("9. november 2026");
  });

  test.each([false, true])(
    "viser kortet i PageHero uavhengig av aktiv dagpengerett (%s)",
    (harDagpengerett) => {
      loaderData.aktivDagpengerett = { status: "success", data: harDagpengerett };
      const html = renderToStaticMarkup(createElement(PageHero));

      expect(html).toContain("Send meldekort");
      if (harDagpengerett) {
        expect(html.indexOf("Send meldekort")).toBeLessThan(html.indexOf("dagpengerett-varsel"));
      } else {
        expect(html).not.toContain("dagpengerett-varsel");
      }
    }
  );
});
