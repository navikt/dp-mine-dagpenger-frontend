
export type Dokumentasjonskrav = {
  id: string;
  spørsmålId: string;
  tittel?: string;
  skjemakode: string;
  seksjonId: string;
  type: DokumentasjonskravType;
  svar?: GyldigDokumentkravSvar;
  begrunnelse?: string;
  skjemaSvar?: Record<string, string | string[] | undefined>;
};

export enum DokumentasjonskravType {
  Barn = "Barn",
  ArbeidsforholdArbeidsavtale = "ArbeidsforholdArbeidsavtale",
  ArbeidsforholdArbeidsgiverenMinHarSagtMegOpp = "ArbeidsforholdArbeidsgiverenMinHarSagtMegOpp",
  ArbeidsforholdJegHarSagtOppSelv = "ArbeidsforholdJegHarSagtOppSelv",
  ArbeidsforholdAvskjedigelse = "ArbeidsforholdAvskjedigelse",
  ArbeidsforholdRedusertArbeidstid = "ArbeidsforholdRedusertArbeidstid",
  ArbeidsforholdOppsigelseFraBostyrerEllerKonkursforvalter = "ArbeidsforholdOppsigelseFraBostyrerEllerKonkursforvalter",
  ArbeidsforholdPermitteringsvarsel = "ArbeidsforholdPermitteringsvarsel",
  ArbeidsforholdRotasjon = "ArbeidsforholdRotasjon",
  Tjenestebevis = "Tjenestebevis",
  Utdanning = "Utdanning",
  ReellArbeidssøkerKanIkkeJobbeHeltidOgDeltid = "ReellArbeidssøkerKanIkkeJobbeHeltidOgDeltid",
  ReellArbeidssøkerKanIkkeJobbeHeleNorge = "ReellArbeidssøkerKanIkkeJobbeHeleNorge",
  ReellArbeidssøkerKanIkkeTaAlleTyperArbeid = "ReellArbeidssøkerKanIkkeTaAlleTyperArbeid",
  AnnenPengestøtteFraAndreEøsLand = "AnnenPengestøtteFraAndreEøsLand",
  AnnenPengestøtteFraNorgePensjonFraAndre = "AnnenPengestøtteFraNorgePensjonFraAndre",
  AnnenPengestøtteFraNorgePengestøtteFraGff = "AnnenPengestøtteFraNorgePengestøtteFraGff",
  AndreUtbetalingerEllerGoderFraTidligereArbeidsgiver = "AndreUtbetalingerEllerGoderFraTidligereArbeidsgiver",
}

export type GyldigDokumentkravSvar =
  | "dokumentkravSvarSendNå"
  | "dokumentkravSvarSenderSenere"
  | "dokumentkravSvarSendtTidligere"
  | "dokumentkravSvarSenderIkke"
  | "dokumentkravEttersendt";

