import { Detail, Heading } from "@navikt/ds-react";
import { useSanity } from "~/hooks/useSanity";
import { hentAvsender } from "~/utils/avsenderMottaker";
import { IDokument, IJournalpost } from "~/utils/safJournalposter.utils";
import { DocumentActionButtons } from "../document-action-buttons/DocumentActionButtons";
import { ExpandableAttachmentsList } from "../expandable-attachments-list/ExpandableAttachmentsList";
import { HiddenDocument } from "../hidden-document/HiddenDocument";
import styles from "./Jounalposter.module.css";

export function JournalpostCard({
  journalpostId,
  datoOpprettet,
  dokumenter,
  brukerErAvsenderEllerMottaker,
  journalposttype,
}: IJournalpost) {
  const { getAppText } = useSanity();

  const dato =
    datoOpprettet &&
    new Date(datoOpprettet).toLocaleString("no-NO", {
      dateStyle: "short",
    });

  function getMainDocument(dokumenter: IDokument[]): IDokument {
    return dokumenter.filter((d) => d.type == "Hoved")[0];
  }

  function getAttechments(dokumenter: IDokument[]): IDokument[] {
    return dokumenter.filter((d) => d.type !== "Hoved");
  }

  const mainDocument = getMainDocument(dokumenter);
  const attachments = getAttechments(dokumenter);

  const sender = hentAvsender({ journalposttype, brukerErAvsenderEllerMottaker });
  const mainDocumentTitle = mainDocument?.tittel || getAppText("journalpost.dokument-uten-tittel");

  return (
    <article className={styles.journalpostCard} aria-labelledby={`tittel-${journalpostId}`}>
      {datoOpprettet && (
        <Detail>
          <time dateTime={datoOpprettet}>{dato}</time> - {sender}
        </Detail>
      )}

      <div className={styles.journalpostCardContainer}>
        <div className={styles.journalpostCardContent}>
          <Heading level="3" size="small" id={`tittel-${journalpostId}`}>
            {mainDocumentTitle}
          </Heading>
        </div>
        {!mainDocument.brukerHarTilgang && <HiddenDocument />}
        {mainDocument.brukerHarTilgang && (
          <DocumentActionButtons
            journalpostId={journalpostId}
            dokumentInfoId={mainDocument.dokumentInfoId}
            title={mainDocumentTitle}
            sender={sender}
          />
        )}
      </div>
      {attachments.length > 0 && (
        <ExpandableAttachmentsList
          attachments={attachments}
          title={mainDocumentTitle}
          journalpostId={journalpostId}
          sender={sender}
        />
      )}
    </article>
  );
}
