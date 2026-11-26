import { Heading } from "@navikt/ds-react";
import { useSanity } from "~/hooks/useSanity";
import { ExternalLink } from "../ExternalLink";
import { PortableTextRenderer } from "../portable-text/PortableTextRenderer";
import styles from "./MeldFraOmEndring.module.css";

export function MeldFraOmEndring() {
  const { getAppText, getRichText, getLink } = useSanity();

  const meldFraOmEndringerLink = getLink("meld-fra-om-endring.melding-om-endring");
  const sendInnDokumentLink = getLink("meld-fra-om-endring.send-inn-dokument");

  return (
    <section className="pageSection">
      <Heading level="2" size="large">
        {getAppText("meld-fra-om-endring.seksjonstittel")}
      </Heading>
      <div className={styles.container}>
        <PortableTextRenderer value={getRichText("meld-fra-om-endring.informasjon")} />
        <nav className={styles.navigationContainer}>
          <ExternalLink size="small" to={meldFraOmEndringerLink.linkUrl} asButtonVariant="primary">
            {meldFraOmEndringerLink.linkText}
          </ExternalLink>
          <ExternalLink size="small" to={sendInnDokumentLink.linkUrl} asButtonVariant="secondary">
            {sendInnDokumentLink.linkText}
          </ExternalLink>
        </nav>
      </div>
    </section>
  );
}
