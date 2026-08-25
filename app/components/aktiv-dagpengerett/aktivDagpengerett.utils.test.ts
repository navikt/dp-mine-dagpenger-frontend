import { describe, expect, test } from "vitest";
import { skalViseAktivDagpengerettAlert } from "./aktivDagpengerett.utils";

describe("skalViseAktivDagpengerettAlert", () => {
  test(`skal returnere true når status er success og data er true`, () => {
    // Gitt
    const aktivDagpengerett = { status: "success" as const, data: true };

    // Når
    const resultat = skalViseAktivDagpengerettAlert(aktivDagpengerett);

    // Så
    expect(resultat).toBe(true);
  });

  test(`skal returnere false når status er success og data er false`, () => {
    // Gitt
    const aktivDagpengerett = { status: "success" as const, data: false };

    // Når
    const resultat = skalViseAktivDagpengerettAlert(aktivDagpengerett);

    // Så
    expect(resultat).toBe(false);
  });

  test(`skal returnere false når status er error`, () => {
    // Gitt
    const aktivDagpengerett = {
      status: "error" as const,
      error: {
        statusCode: 500,
        statusText: "Klarte ikke hente aktiv dagpengerett",
      },
    };

    // Når
    const resultat = skalViseAktivDagpengerettAlert(aktivDagpengerett);

    // Så
    expect(resultat).toBe(false);
  });
});
