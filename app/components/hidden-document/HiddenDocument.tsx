import { EyeSlashIcon } from "@navikt/aksel-icons";
import { Button, Popover } from "@navikt/ds-react";
import { PortableText } from "@portabletext/react";
import { useRef, useState } from "react";
import styles from "./HiddenDocument.module.css";
import { useSanity } from "~/hooks/useSanity";

export function HiddenDocument() {
  const [isOpen, setIsOpen] = useState(false);
  const { getAppText, getRichText } = useSanity();
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <div className={styles.hiddenDocumentContainer}>
      <p className={styles.hiddenDocumentLabel}>
        <EyeSlashIcon fontSize="1.5rem" aria-hidden className={styles.hiddenDocumentIcon} />
        {getAppText("skjult-dokument.kan-ikke-vises")}
      </p>

      <Button ref={buttonRef} variant="tertiary" size="small" onClick={() => setIsOpen(!isOpen)}>
        {getAppText("skjult-dokument.hvorfor-vises-ikke-dokumentet")}
      </Button>
      <Popover
        open={isOpen}
        onClose={() => setIsOpen(false)}
        anchorEl={buttonRef.current}
        placement="bottom"
      >
        <Popover.Content className={styles.explanationPopover}>
          <PortableText value={getRichText("skjult-dokumenter.forklaringstekst")} />
        </Popover.Content>
      </Popover>
    </div>
  );
}
