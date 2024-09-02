import { graphql } from "graphql/generated/saf";
import {
  Datotype,
  DokumentoversiktSelvbetjeningQuery,
  Journalpost,
  Variantformat,
} from "graphql/generated/saf/graphql";

export const graphqlQuery = graphql(`
  query dokumentoversiktSelvbetjening($fnr: String!) {
    dokumentoversiktSelvbetjening(ident: $fnr, tema: [DAG, OPP]) {
      journalposter {
        journalpostId
        tema
        tittel
        relevanteDatoer {
          dato
          datotype
        }
        avsender {
          id
          navn
          type
        }
        mottaker {
          id
          navn
          type
        }
        journalposttype
        journalstatus
        dokumenter {
          dokumentInfoId
          tittel
          dokumentvarianter {
            variantformat
            brukerHarTilgang
          }
        }
      }
    }
  }
`);

export type GeneratedDokumentoversiktSelvbetjening =
  DokumentoversiktSelvbetjeningQuery["dokumentoversiktSelvbetjening"];
export type GeneratedJournalposter = GeneratedDokumentoversiktSelvbetjening["journalposter"];

export type IDokument = {
  __typename?: "DokumentInfo";
  dokumentInfoId?: string;
  tittel?: string | null;
  dokumentvarianter?: ({
    __typename?: "Dokumentvariant";
    variantformat: Variantformat;
    brukerHarTilgang: boolean;
  } | null)[];
};

export interface IUtvidedDokument extends IDokument {
  type: "Hoved" | "Vedlegg";
  brukerHarTilgang?: boolean;
}

export interface IUtvidedJournalpost
  extends Omit<GeneratedJournalposter[number], "relevanteDatoer"> {
  datoOpprettet?: string | null;
  brukerErAvsenderEllerMottaker?: boolean;
}

export interface IJournalpost extends Omit<IUtvidedJournalpost, "dokumenter"> {
  datoOpprettet?: string | null;
  dokumenter?: IUtvidedDokument[];
}

export function finnOgSettOpprettetDato({
  relevanteDatoer,
  ...rest
}: Journalpost): IUtvidedJournalpost {
  const datoOpprettet = relevanteDatoer.find((dato) => dato?.datotype === Datotype.DatoOpprettet);

  return {
    datoOpprettet: datoOpprettet?.dato,
    ...rest,
  };
}

export function berikAvsenderEllerMottaker(
  { avsender, mottaker, ...rest }: IUtvidedJournalpost,
  fnr: string
): IUtvidedJournalpost {
  const brukerErAvsender = avsender?.id === fnr && avsender.type === "FNR";
  const brukerErMottaker = mottaker?.id === fnr && mottaker.type === "FNR";

  return {
    brukerErAvsenderEllerMottaker: brukerErAvsender || brukerErMottaker,
    ...rest,
  };
}

export function berikDokumentMedType(dokument: IDokument | null, index: number): IUtvidedDokument {
  return {
    type: index === 0 ? "Hoved" : "Vedlegg",
    ...dokument,
  };
}

export function berikBrukerDokumentTilgang({
  dokumentvarianter,
  ...rest
}: IUtvidedDokument): IUtvidedDokument {
  const arkivDokument = dokumentvarianter?.find((dokumentvariant) => {
    return dokumentvariant?.variantformat === "ARKIV";
  });

  const brukerHarTilgang = arkivDokument?.brukerHarTilgang || false;

  return { brukerHarTilgang: brukerHarTilgang, dokumentvarianter, ...rest };
}
