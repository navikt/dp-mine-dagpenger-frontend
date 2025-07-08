import { DownloadIcon, FileSearchIcon } from "@navikt/aksel-icons";
import { BodyLong, Button, Modal } from "@navikt/ds-react";
import { useRef, useState } from "react";
import { loggDokumenterPreviewTid, loggLastnedDokument } from "~/amplitude/amplitude";
import { useSanity } from "~/hooks/useSanity";
// import { getEnv } from "~/utils/env.utils";
import { logger } from "~/utils/logger.utils";
import styles from "./DocumentActionButtons.module.css";

interface IProps {
  journalpostId: string;
  dokumentInfoId: string;
  title: string;
  sender: string;
}

export function DocumentActionButtons({ journalpostId, dokumentInfoId, title, sender }: IProps) {
  const { getAppText } = useSanity();
  const ref = useRef<HTMLDialogElement>(null);
  const [dokumentUrl, setDokumentUrl] = useState<string | null>(null);
  const [starPreviewTimeStamp, setStartPreviewTimeStamp] = useState<Date | null>(null);
  // const basePath = getEnv("IS_LOCALHOST") === "true" ? "" : getEnv("BASE_PATH").replace(/\/$/, "");

  async function aapneDokument() {
    setStartPreviewTimeStamp(new Date());
    const url = `/api/hent-dokument/${journalpostId}/${dokumentInfoId}`;
    const response = await fetch(url);

    console.log(`🔥 url :`, url);

    if (!response.ok) {
      logger.error(`Klarte ikke åpne PDF fra ${url}`);

      throw new Response(`Klarte ikke åpne PDF fra ${url}`, {
        status: response.status,
        statusText: response.statusText,
      });
    }

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    if (blobUrl) {
      setDokumentUrl(blobUrl);
    }

    ref.current?.showModal();
  }

  async function lastnedDokument() {
    const url = `/api/hent-dokument/${journalpostId}/${dokumentInfoId}`;
    const response = await fetch(url);

    if (!response.ok) {
      logger.error(`Klarte ikke laste need PDF fra ${url}`);

      throw new Response(`Klarte ikke laste need PDF fra ${url}`, {
        status: response.status,
        statusText: response.statusText,
      });
    }

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = `${title}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(blobUrl); // Cleanup the Blob URL

    loggLastnedDokument(title, sender);
  }

  function onClose() {
    setDokumentUrl(null);
    ref.current?.close();

    if (starPreviewTimeStamp) {
      const endPreviewTimeStamp = new Date().getTime();
      const totalPreviewTimeInSeconds =
        (endPreviewTimeStamp - starPreviewTimeStamp.getTime()) / 1000;
      loggDokumenterPreviewTid(totalPreviewTimeInSeconds);
    }
  }

  return (
    <div className={styles.documentActionButtons}>
      <Button
        variant="tertiary"
        size="small"
        icon={<DownloadIcon fontSize="1.5rem" aria-hidden />}
        onClick={lastnedDokument}
      >
        {getAppText("dokumenter.last-ned-pdf")}
      </Button>
      <>
        <Button
          variant="tertiary"
          size="small"
          icon={<FileSearchIcon fontSize="1.5rem" aria-hidden />}
          onClick={aapneDokument}
        >
          {getAppText("dokumenter.forhaandvisning")}
        </Button>
        <Modal
          ref={ref}
          className={styles.dokumentPreview}
          onClose={onClose}
          header={{ heading: title }}
        >
          <Modal.Body>
            <BodyLong>
              {dokumentUrl && (
                <iframe
                  src={dokumentUrl}
                  title={title}
                  width="100%"
                  height="800px"
                  frameBorder="0"
                />
              )}
            </BodyLong>
          </Modal.Body>
        </Modal>
      </>
    </div>
  );
}
