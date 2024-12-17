import { getAmplitudeInstance } from "@navikt/nav-dekoratoren-moduler";

const logger = getAmplitudeInstance("dekoratoren");

const appName = {
  appname: "dp-mine-dagpenger-frontend",
};

export function loggLastnedDokument(dokumentTittel: string, sender: string) {
  logger("lastet ned dokument", {
    ...appName,
    dokumentTittel,
    sender,
  });
}

export function loggPreviewDokument(dokumentId: string) {
  logger("preview dokument", {
    ...appName,
    dokumentId,
  });
}

export function loggKlikkVisVedlegg(journalpostId: string) {
  logger("klikk vis vedlegg", {
    ...appName,
    journalpostId,
  });
}

export function loggKlikkVisAlleDokumenter(antallJournalposter: number) {
  logger("klikk vis alle dokumenter", { ...appName, antallJournalposter });
}

export function loggDokumenterPreviewTid(sekundBrukt: number) {
  logger("tiden bruker på å dokument preview modal", { ...appName, sekundBrukt });
}

export function loggKlikkSnarvei(snarvei: string) {
  logger("bruker trykker på en snarvei lenke", { ...appName, snarvei });
}

export function loggAapneForklaringAvSkjultDokument() {
  logger("åpnet forklaring av skjult dokument", { ...appName });
}

export function loggMeldFraOmEndring(endringsType: string) {
  logger("meld fra om endring", { ...appName, endring: endringsType });
}
