import { graphql } from "graphql/generated/saf";
import {
  AvsenderMottaker,
  Datotype,
  Dokumentvariant,
  Journalposttype,
  Journalstatus,
  Kanal,
  RelevantDato,
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

// Lager egne intefaces isteden for å bruke generert types fra graphql-codegen direkte.
// Dette er på grunn av genererte types inneholder Maybe som er vanskelig å jobbe med.
export interface IJournalpost {
  avsender?: AvsenderMottaker;
  dokumenter?: IEgenDefinertDokument[];
  eksternReferanseId?: string;
  journalpostId: string;
  journalposttype: Journalposttype;
  journalstatus?: Journalstatus;
  kanal?: Kanal;
  mottaker?: AvsenderMottaker;
  relevanteDatoer?: RelevantDato[];
  tema?: string;
  tittel?: string;
  datoOpprettet?: string | null;
  brukerErAvsenderEllerMottaker?: boolean;
}

export interface IEgenDefinertDokument {
  dokumentInfoId?: string;
  tittel?: string | null;
  dokumentvarianter?: Dokumentvariant[];
  type?: "Hoved" | "Vedlegg";
  brukerHarTilgang?: boolean;
}

export function finnOgSettOpprettetDato({ relevanteDatoer, ...rest }: IJournalpost): IJournalpost {
  const datoOpprettet = relevanteDatoer?.find((dato) => dato?.datotype === Datotype.DatoOpprettet);

  return {
    datoOpprettet: datoOpprettet?.dato,
    ...rest,
  };
}

export function berikAvsenderEllerMottaker(
  { avsender, mottaker, ...rest }: IJournalpost,
  fnr: string
): IJournalpost {
  const brukerErAvsender = avsender?.id === fnr && avsender.type === "FNR";
  const brukerErMottaker = mottaker?.id === fnr && mottaker.type === "FNR";

  return {
    brukerErAvsenderEllerMottaker: brukerErAvsender || brukerErMottaker,
    ...rest,
  };
}

export function berikDokumentMedType(
  dokument: IEgenDefinertDokument,
  index: number
): IEgenDefinertDokument {
  return {
    type: index === 0 ? "Hoved" : "Vedlegg",
    ...dokument,
  };
}

export function berikBrukerDokumentTilgang({
  dokumentvarianter,
  ...rest
}: IEgenDefinertDokument): IEgenDefinertDokument {
  const arkivDokument = dokumentvarianter?.find((dokumentvariant) => {
    return dokumentvariant?.variantformat === "ARKIV";
  });

  const brukerHarTilgang = arkivDokument?.brukerHarTilgang || false;

  return { brukerHarTilgang: brukerHarTilgang, dokumentvarianter, ...rest };
}
