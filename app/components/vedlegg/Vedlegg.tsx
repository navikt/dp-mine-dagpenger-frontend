import { BodyShort } from "@navikt/ds-react";
import { DocumentActionButtons } from "../document-action-buttons/DocumentActionButtons";
import { SkjultDokument } from "../skjult-dokument/SkjultDokument";
import styles from "./Vedlegg.module.css";

interface IProps {
  tittel: string;
  brukerHarTilgang?: boolean;
  journalpostId: string;
  dokumentInfoId: string;
  datoOpprettet?: string;
}

export function Vedlegg({
  tittel: title,
  brukerHarTilgang: userHaveAccess,
  journalpostId,
  dokumentInfoId,
}: IProps) {
  return (
    <div className={styles.vedlegg}>
      <BodyShort className={styles.vedleggTittel}>{title}</BodyShort>
      {!userHaveAccess && <SkjultDokument />}
      {userHaveAccess && (
        <DocumentActionButtons
          journalpostId={journalpostId}
          dokumentInfoId={dokumentInfoId}
          title={title}
        />
      )}
    </div>
  );
}
