import { BodyShort, Heading, Link } from "@navikt/ds-react";
import { loggKlikkSnarvei } from "~/amplitude/amplitude";
import { useSanity } from "~/hooks/useSanity";
import type { ISanityLink } from "~/sanity/sanity.types";
import { Section } from "../section/Section";
import { SectionContent } from "../section/SectionContent";
import styles from "./Shortcuts.module.css";

export function Shortcuts() {
  const { getAppText, getLink } = useSanity();

  const shortcuts: ISanityLink[] = [
    getLink("snarveier.send-klage"),
    getLink("snarveier.skriv-til-oss"),
    getLink("snarveier.saldo-og-tilbakebetaling"),
    getLink("snarveier.ny-soknad-om-dagpenger"),
  ];

  return (
    <Section>
      <SectionContent fullWidth>
        <Heading level="2" size="large">
          {getAppText("snarveier.seksjonstittel")}
        </Heading>
        <ul className={styles.shortcuts}>
          {shortcuts.map(({ linkId, linkText, linkUrl, linkDescription }) => {
            return (
              <li key={linkId} className={styles.shortcut}>
                <Link
                  className={styles.shortcutLink}
                  href={linkUrl}
                  onClick={() => loggKlikkSnarvei(linkText)}
                >
                  {linkText}
                </Link>
                {linkDescription && (
                  <BodyShort className={styles.shortcutDescription} size="small">
                    {linkDescription}
                  </BodyShort>
                )}
              </li>
            );
          })}
        </ul>
      </SectionContent>
    </Section>
  );
}
