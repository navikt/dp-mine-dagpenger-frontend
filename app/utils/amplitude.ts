import { getAmplitudeInstance } from "@navikt/nav-dekoratoren-moduler";

const logger = getAmplitudeInstance("dekoratoren");

export function loggLastned(dokumentId: string) {
  logger("Dokument nedlastet", {
    dokumentId,
  });
}
