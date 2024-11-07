import { init, track } from "@amplitude/analytics-browser";
import { getEnv } from "./utils/env.utils";

export const initAmplitude = () => {
  if (getEnv("IS_LOCALHOST")) return;

  init("default", undefined, {
    useBatch: true,
    serverUrl: "https://amplitude.nav.no/collect-auto",
    ingestionMetadata: {
      sourceName: window.location.toString(),
    },
  });
};

const appName = {
  appname: "dp-mine-dagpenger-frontend",
};

export function trackClickedShortcut(snarvei: string) {
  track("klikket på snarvei", {
    ...appName,
    snarvei,
  });
}

export function trackDocumentDownloaded(dokumentTittel: string, sender: string) {
  track("lastet ned dokument", {
    ...appName,
    dokumentTittel,
    sender,
  });
}

export function trackClickedShowAllDocuments(antallDokumenter: number) {
  track("klikket på vis alle dokumenter", {
    ...appName,
    antallDokumenter,
  });
}

export function åpnetVedleggsliste(dokumentTittel: string, sender: string, antallVedlegg: string) {
  track("åpnet vedleggsliste", {
    ...appName,
    dokumentTittel,
    sender,
    antallVedlegg,
  });
}

export function skjulteVedleggsliste(
  dokumentTittel: string,
  sender: string,
  antallVedlegg: string
) {
  track("skjulte vedleggsliste", {
    ...appName,
    dokumentTittel,
    sender,
    antallVedlegg,
  });
}

export function åpnetForhåndsvisning(dokumentTittel: string, sender: string) {
  track("åpnet forhåndsvisning av dokument", {
    ...appName,
    dokumentTittel,
    sender,
  });
}

export function vistDokumentlisten(
  antallDagpenger: number,
  antallOppfølging: number,
  antallSøknader: number,
  antallDagerSidenSøknad: number
) {
  track("så dokumentlisten", {
    ...appName,
    antallDagpenger,
    antallOppfølging,
    antallSøknader,
    antallDagerSidenSøknad,
  });
}

export function lukketForhåndsvisning(dokumentTittel: string, sender: string, visningstid: number) {
  track("lukket forhåndsvisning av dokument", {
    ...appName,
    dokumentTittel,
    sender,
    visningstid,
  });
}

export function åpnetHvorforVisesIkkeDokumentet(dokumentTittel: string, sender: string) {
  track("klikket på vis alle dokumenter", {
    ...appName,
    dokumentTittel,
    sender,
  });
}
