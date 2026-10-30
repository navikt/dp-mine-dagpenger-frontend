import { afterEach, describe, expect, test, vi } from "vitest";
import { hentMeldekort } from "./hentMeldekort.server";

vi.mock("~/utils/env.utils", () => ({
  getEnv: () => "https://meldekortregister.test",
}));

vi.mock("~/utils/auth.utils.server", () => ({
  getMeldekortRegisterToken: async () => "test-token",
}));

vi.mock("~/utils/logger.utils", () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
  },
}));

describe("hentMeldekort", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test("returnerer tom meldekortstatus når registeret svarer 204", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 204 })));

    await expect(hentMeldekort(new Request("http://localhost"))).resolves.toEqual({
      status: "success",
      data: {
        harInnsendteMeldekort: false,
        meldekortTilUtfylling: [],
        redirectUrl: null,
      },
    });
  });
});
