import { Button, Heading, Link } from "@navikt/ds-react";
import { PortableText } from "@portabletext/react";
import { Section } from "../section/Section";
import { SectionContent } from "../section/SectionContent";
import styles from "./MeldFraOmEndring.module.css";
import { useSanity } from "~/hooks/useSanity";

export const MeldFraOmEndring = () => {
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
            <Link href={meldFraOmEndringerLink.linkUrl}>
              <Button variant="secondary">{meldFraOmEndringerLink.linkText}</Button>
            </Link>
            <Link href={sendInnDokumentLink.linkUrl}>
              <Button variant="secondary">{sendInnDokumentLink.linkText}</Button>
            </Link>
          </nav>
        </div>
      </SectionContent>
    </Section>
  );
};
