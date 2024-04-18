import { BodyShort, Button, Heading, Tag } from "@navikt/ds-react";
import { useSanity } from "~/hooks/useSanity";
import { IPaabegynteSoknad } from "~/models/getSoknader.models";
import { FormattedDate } from "../FormattedDate";
import { RemixLink } from "../RemixLink";
import styles from "./Soknader.module.css";

interface IProps {
  soknad: IPaabegynteSoknad;
}

export function PaabegynteSoknader({ soknad }: IProps) {
  const { tittel, sistEndret: dato, endreLenke, søknadId } = soknad;
  const { getAppText } = useSanity();

  return (
    <li className={styles.soknadContainer}>
      <article className={styles.soknadContent} aria-labelledby={`tittel-${søknadId}`}>
        <Heading level="3" size="small" id={`tittel-${søknadId}`}>
          {tittel} {getAppText("paabegynt-soknad.paabegynt-status")}
        </Heading>
        <BodyShort className={styles.soknadDate} size="small">
          {getAppText("paabegynt-soknad.sist-endret.label-tekst")}
          <FormattedDate date={dato} />
        </BodyShort>
        <Tag variant="neutral" size="small" className={styles.soknadTag}>
          {getAppText("paabegynt-soknad.soknad-er-ikke-sendt-inn")}
        </Tag>
      </article>
      <nav className={styles.soknadLinksContainer}>
        <RemixLink to={endreLenke}>
          <Button as="a" variant="secondary" size="small">
            {getAppText("paabegynt-soknad.fortsett-paa-soknaden")}
          </Button>
        </RemixLink>
      </nav>
    </li>
  );
}
