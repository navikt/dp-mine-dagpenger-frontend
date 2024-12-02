import { ChevronDownIcon } from "@navikt/aksel-icons";
import classNames from "classnames";
import { useState } from "react";
import styles from "./ExpandableAttchmentsList.module.css";
import { IDokument } from "~/utils/safJournalposter.utils";
import { useSanity } from "~/hooks/useSanity";
import { Attachment } from "../attachment/Attachment";

interface IProps {
  attachments: IDokument[];
  title: string;
  journalpostId: string;
}

export function ExpandableAttachmentsList({ attachments, journalpostId }: IProps) {
  const { getAppText } = useSanity();
  const [expanded, setExpanded] = useState(false);

  function handleExpand() {
    setExpanded(!expanded);
  }

  function getAttechmentsButtonText() {
    if (!expanded) {
      return `${getAppText("journalpost.vis-veglegg.knapp.tekst")} (${attachments.length})`;
    }

    return `${getAppText("journalpost.skjul-veglegg.knapp.tekst")} (${attachments.length})`;
  }

  return (
    <div className={styles.expandable}>
      <button className={styles.expandableTittel} onClick={() => handleExpand()}>
        <ChevronDownIcon
          className={classNames({
            [styles.expanded]: expanded,
          })}
          fontSize="1.5rem"
          aria-hidden
        />
        {getAttechmentsButtonText()}
      </button>
      <div
        className={expanded ? styles.showAttachments : styles.hideAttachments}
        aria-hidden={!expanded}
      >
        {expanded &&
          attachments.map((dokument) => (
            <Attachment
              key={dokument.dokumentInfoId}
              title={dokument.tittel || getAppText("journalpost.dokument-uten-tittel")}
              userHaveAccess={dokument.brukerHarTilgang}
              journalpostId={journalpostId}
              dokumentInfoId={dokument.dokumentInfoId}
            />
          ))}
      </div>
    </div>
  );
}
