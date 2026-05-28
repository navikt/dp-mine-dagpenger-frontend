import { graphql } from "~/graphql/generated/saf";
import {
  type AvsenderMottakerIdType,
  type Datotype,
  type Journalposttype,
  type Variantformat,
} from "~/graphql/generated/saf/graphql";

type AvsenderMottaker = {
  id: string;
  navn: string;
  type: AvsenderMottakerIdType;
};

type Dokumentvariant = {
  variantformat: Variantformat;
  brukerHarTilgang: boolean;
};

type RelevantDato = {
  dato: string;
  datotype: Datotype;
};

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
  avsender?: AvsenderMottaker | null;
  dokumenter: IDokument[];
  eksternReferanseId?: string;
  journalpostId: string;
  journalposttype: Journalposttype;
  mottaker?: AvsenderMottaker | null;
  relevanteDatoer?: Array<RelevantDato | null>;
  tema: string;
  tittel: string;
  datoOpprettet?: string | null;
  brukerErAvsenderEllerMottaker?: boolean;
}

export interface IDokument {
  dokumentInfoId: string;
  tittel: string | null;
  dokumentvarianter?: Array<Dokumentvariant | null>;
  type?: "Hoved" | "Vedlegg";
  brukerHarTilgang?: boolean;
}

export function settDatoOpprettet({ relevanteDatoer, ...rest }: IJournalpost): IJournalpost {
  const datoOpprettet = relevanteDatoer?.find((dato) => dato?.datotype === "DATO_OPPRETTET");

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

export function berikDokumentMedType(dokument: IDokument, index: number): IDokument {
  return {
    type: index === 0 ? "Hoved" : "Vedlegg",
    ...dokument,
  };
}

export function berikBrukerDokumentTilgang({ dokumentvarianter, ...rest }: IDokument): IDokument {
  const arkivDokument = dokumentvarianter?.find((dokumentvariant) => {
    return dokumentvariant?.variantformat === "ARKIV";
  });

  return { brukerHarTilgang: arkivDokument?.brukerHarTilgang || false, dokumentvarianter, ...rest };
}
