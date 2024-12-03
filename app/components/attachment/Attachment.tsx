import { BodyShort } from "@navikt/ds-react";
import { DocumentActionButtons } from "../document-action-buttons/DocumentActionButtons";
import { HiddenDocument } from "../hidden-document/HiddenDocument";
import styles from "./Attachment.module.css";

interface IProps {
  title: string;
  sender: string;
  userHaveAccess?: boolean;
  journalpostId: string;
  dokumentInfoId: string;
  datoOpprettet?: string;
}

export function Attachment({
  title,
  userHaveAccess,
  journalpostId,
  dokumentInfoId,
  sender,
}: IProps) {
  return (
    <div className={styles.attachment}>
      <BodyShort className={styles.attachmentTitle}>{title}</BodyShort>
      {!userHaveAccess && <HiddenDocument />}
      {userHaveAccess && (
        <DocumentActionButtons
          journalpostId={journalpostId}
          dokumentInfoId={dokumentInfoId}
          title={title}
          sender={sender}
        />
      )}
    </div>
  );
}
