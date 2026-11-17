import { Heading, LinkCard } from "@navikt/ds-react";
import { useSanity } from "~/hooks/useSanity";
import type { ISanityLink } from "~/sanity/sanity.types";
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
    <section className="pageSection">
      <Heading level="2" size="large">
        {getAppText("snarveier.seksjonstittel")}
      </Heading>
      <ul className={styles.shortcuts}>
        {shortcuts.map(({ linkId, linkText, linkUrl, linkDescription }) => {
          return (
            <li key={linkId}>
              <LinkCard className={styles.shortcut}>
                <LinkCard.Title>
                  <LinkCard.Anchor href={linkUrl}>{linkText}</LinkCard.Anchor>
                </LinkCard.Title>
                {linkDescription && <LinkCard.Description>{linkDescription}</LinkCard.Description>}
              </LinkCard>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
