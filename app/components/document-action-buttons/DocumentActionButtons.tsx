import { DownloadIcon, FileSearchIcon } from "@navikt/aksel-icons";
import { BodyLong, Button, Modal } from "@navikt/ds-react";
import { useRef, useState } from "react";
import { useSanity } from "~/hooks/useSanity";
import styles from "./DocumentActionButtons.module.css";
import { getEnv } from "~/utils/env.utils";

interface IProps {
  journalpostId: string;
  dokumentInfoId: string;
}

export function DocumentActionButtons({ journalpostId, dokumentInfoId }: IProps) {
  const { getAppText } = useSanity();
  const ref = useRef<HTMLDialogElement>(null);
  const [dokumentUrl, setDokumentUrl] = useState<string | null>(null);

  async function aapneDokument() {
    const basePath = getEnv("BASE_PATH").replace(/\/$/, ""); // Fjern ekstra slash på slutten av BASE_PATH

    const url = `${basePath}/api/hent-dokument/${journalpostId}/${dokumentInfoId}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Response(`Feil ved kall til ${url}`, {
        status: response.status,
        statusText: response.statusText,
      });
    }

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    setDokumentUrl(blobUrl);
    ref.current?.showModal();
  }

  async function lastnedDokument() {
    const basePath = getEnv("BASE_PATH").replace(/\/$/, ""); // Fjern ekstra slash på slutten av BASE_PATH
    const url = `${basePath}/api/hent-dokument/${journalpostId}/${dokumentInfoId}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Response(`Feil ved kall til ${url}`, {
        status: response.status,
        statusText: response.statusText,
      });
    }

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = `${dokumentInfoId}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(blobUrl); // Cleanup the Blob URL
  }

  return (
    <div className={styles.documentActionButtons}>
      <Button
        variant="tertiary"
        size="small"
        icon={<DownloadIcon fontSize="1.5rem" aria-hidden />}
        onClick={lastnedDokument}
      >
        {/* lastned */}
        {getAppText("dokumenter.last-ned-pdf")}
      </Button>
      <>
        <Button
          variant="tertiary"
          size="small"
          icon={<FileSearchIcon fontSize="1.5rem" aria-hidden />}
          // onClick={() => ref.current?.showModal()}
          onClick={aapneDokument}
        >
          {/* åpne pdf */}
          {getAppText("dokumenter.forhaandvisning")}
        </Button>
        <Modal ref={ref} header={{ heading: "" }}>
          <Modal.Body className={styles.dokumentPreview}>
            <BodyLong>
              {dokumentUrl && (
                <iframe src={dokumentUrl} title="PDF" width="100%" height="800px" frameBorder="0" />
              )}
            </BodyLong>
          </Modal.Body>
        </Modal>
      </>
    </div>
  );
}
