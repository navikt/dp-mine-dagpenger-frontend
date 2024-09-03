import { Journalposttype } from "graphql/generated/saf/graphql";
import { IJournalpost } from "./safJournalposter.utils";

type JP = Pick<IJournalpost, "journalposttype" | "brukerErAvsenderEllerMottaker">;
type Predikat = (j: JP) => boolean | undefined;

const UTGAAENDE = (j: JP): boolean => Journalposttype.U === j.journalposttype;
const INNKOMMENDE = (j: JP): boolean => Journalposttype.I === j.journalposttype;
const NOTAT = (j: JP): boolean => Journalposttype.N === j.journalposttype;

const BRUKER_ER_AVSENDERMOTTAKER = (j: JP) => j.brukerErAvsenderEllerMottaker;

export const sendtFraBrukerTilNAV = (j: JP) => INNKOMMENDE(j) && BRUKER_ER_AVSENDERMOTTAKER(j);
export const sendtFraEksternPartTilNAV = (j: JP) =>
  INNKOMMENDE(j) && !BRUKER_ER_AVSENDERMOTTAKER(j);
export const sendtFraNAVTilBruker = (j: JP) => UTGAAENDE(j) && BRUKER_ER_AVSENDERMOTTAKER(j);
export const sendtFraNAVTilEksternPart = (j: JP) => UTGAAENDE(j) && !BRUKER_ER_AVSENDERMOTTAKER(j);

export const meldingInternt = (j: JP) => NOTAT(j) && !BRUKER_ER_AVSENDERMOTTAKER(j);

type PredikatTekstPar = { predikat: Predikat; tekst: string };

const predikater: PredikatTekstPar[] = [
  { predikat: sendtFraBrukerTilNAV, tekst: "Innsendt av deg" },
  { predikat: sendtFraEksternPartTilNAV, tekst: "Innsendt fra tredjepart" },
  { predikat: sendtFraNAVTilBruker, tekst: "Sendt av NAV til deg" },
  { predikat: sendtFraNAVTilEksternPart, tekst: "Sendt av NAV til tredjepart" },
  { predikat: meldingInternt, tekst: "Saksdokument" },
  { predikat: () => true, tekst: "Avsender ukjent" },
];

export const hentAvsender = (j: JP) => {
  return predikater.find((par) => par.predikat(j))?.tekst;
};
