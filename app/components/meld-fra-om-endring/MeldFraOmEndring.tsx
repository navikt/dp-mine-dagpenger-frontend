import { Heading } from "@navikt/ds-react";
import { PortableText } from "@portabletext/react";
import { useSanity } from "~/hooks/useSanity";
import { ExternalLink } from "../ExternalLink";
import { Section } from "../section/Section";
import { SectionContent } from "../section/SectionContent";
import styles from "./MeldFraOmEndring.module.css";
import { loggMeldFraOmEndring } from "~/amplitude/amplitude";

export function MeldFraOmEndring() {
  const { getAppText, getRichText, getLink } = useSanity();

  const meldFraOmEndringerLink = getLink("meld-fra-om-endring.melding-om-endring");
  const sendInnDokumentLink = getLink("meld-fra-om-endring.send-inn-dokument");

  return (
    <Section>
      <SectionContent>
        <Heading level="2" size="large" spacing>
          {getAppText("meld-fra-om-endring.seksjonstittel")}
        </Heading>
        <div className={styles.container}>
          <Heading level="3" size="small" spacing>
            {getAppText("meld-fra-om-endring.informasjon-tittel")}
          </Heading>
          <PortableText value={getRichText("meld-fra-om-endring.informasjon")} />
          <nav className={styles.navigationContainer}>
            <ExternalLink
              to={meldFraOmEndringerLink.linkUrl}
              asButtonVariant="secondary"
              onClick={() => loggMeldFraOmEndring("send-melding-om-endring")}
            >
              {meldFraOmEndringerLink.linkText}
            </ExternalLink>
            <ExternalLink
              to={meldFraOmEndringerLink.linkUrl}
              asButtonVariant="secondary"
              onClick={() => loggMeldFraOmEndring("send-inn-dokument")}
            >
              {sendInnDokumentLink.linkText}
            </ExternalLink>
          </nav>
        </div>
      </SectionContent>
    </Section>
  );
}
