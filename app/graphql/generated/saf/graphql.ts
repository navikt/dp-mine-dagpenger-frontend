/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type AvsenderMottakerIdType =
  | 'FNR'
  | 'HPRNR'
  | 'NULL'
  | 'ORGNR'
  | 'UKJENT'
  | 'UTL_ORG';

export type Datotype =
  | 'DATO_AVS_RETUR'
  | 'DATO_DOKUMENT'
  | 'DATO_EKSPEDERT'
  | 'DATO_JOURNALFOERT'
  | 'DATO_OPPRETTET'
  | 'DATO_REGISTRERT'
  | 'DATO_SENDT_PRINT';

export type Journalposttype =
  | 'I'
  | 'N'
  | 'U';

export type Variantformat =
  | 'ARKIV'
  | 'SLADDET';

export type DokumentoversiktSelvbetjeningQueryVariables = Exact<{
  fnr: string;
}>;


export type DokumentoversiktSelvbetjeningQuery = { dokumentoversiktSelvbetjening: { journalposter: Array<{ journalpostId: string, tema: string | null, tittel: string | null, journalposttype: Journalposttype, relevanteDatoer: Array<{ dato: unknown, datotype: Datotype } | null>, avsender: { id: string, navn: string, type: AvsenderMottakerIdType } | null, mottaker: { id: string, navn: string, type: AvsenderMottakerIdType } | null, dokumenter: Array<{ dokumentInfoId: string, tittel: string | null, dokumentvarianter: Array<{ variantformat: Variantformat, brukerHarTilgang: boolean } | null> } | null> | null }> } };


export const DokumentoversiktSelvbetjeningDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"dokumentoversiktSelvbetjening"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fnr"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dokumentoversiktSelvbetjening"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ident"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fnr"}}},{"kind":"Argument","name":{"kind":"Name","value":"tema"},"value":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"DAG"},{"kind":"EnumValue","value":"OPP"}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"journalposter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"journalpostId"}},{"kind":"Field","name":{"kind":"Name","value":"tema"}},{"kind":"Field","name":{"kind":"Name","value":"tittel"}},{"kind":"Field","name":{"kind":"Name","value":"relevanteDatoer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dato"}},{"kind":"Field","name":{"kind":"Name","value":"datotype"}}]}},{"kind":"Field","name":{"kind":"Name","value":"avsender"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"navn"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mottaker"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"navn"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"journalposttype"}},{"kind":"Field","name":{"kind":"Name","value":"dokumenter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dokumentInfoId"}},{"kind":"Field","name":{"kind":"Name","value":"tittel"}},{"kind":"Field","name":{"kind":"Name","value":"dokumentvarianter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"variantformat"}},{"kind":"Field","name":{"kind":"Name","value":"brukerHarTilgang"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<DokumentoversiktSelvbetjeningQuery, DokumentoversiktSelvbetjeningQueryVariables>;