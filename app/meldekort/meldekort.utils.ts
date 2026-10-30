import type { MeldekortStatus } from "~/models/hentMeldekort.server";

export function hentMeldekortForVisning(status: MeldekortStatus, dagensDatoNorge: string) {
  const meldekortEtterDato = [...status.meldekortTilUtfylling].sort((a, b) =>
    a.kanSendesFra.localeCompare(b.kanSendesFra)
  );
  const sendMeldekortUrl = status.redirectUrl?.trim();
  const meldekortKlartEtterDato = meldekortEtterDato.find(
    (kort) => kort.kanSendesFra <= dagensDatoNorge
  );

  return {
    sendMeldekortUrl,
    klartMeldekort: sendMeldekortUrl ? meldekortKlartEtterDato : undefined,
    nesteMeldekort: !meldekortKlartEtterDato
      ? meldekortEtterDato.find((kort) => kort.kanSendesFra > dagensDatoNorge)
      : undefined,
  };
}
