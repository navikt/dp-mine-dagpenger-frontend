import { BodyShort } from "@navikt/ds-react";
import { useSanity } from "~/hooks/useSanity";
import { HiddenDocument } from "../hidden-document/HiddenDocument";
import styles from "./Attachment.module.css";

interface IProps {
  title: string | null;
  userHaveAccess?: boolean;
}

export function Attachment({ title, userHaveAccess }: IProps) {
  const { getAppText } = useSanity();

  return (
    <div className={styles.attachment}>
      <BodyShort className={styles.attachmentTitle}>
        {title || getAppText("journalpost.dokument-uten-tittel")}
      </BodyShort>
      {!userHaveAccess && <HiddenDocument />}
    </div>
  );
}
