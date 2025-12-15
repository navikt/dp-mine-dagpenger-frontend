import { BodyShort, Heading, Tag } from "@navikt/ds-react";
import { useSanity } from "~/hooks/useSanity";
import type { IPaabegynteSoknad } from "~/models/getPaabegynteSoknader.server";
import { FormattedDate } from "../FormattedDate";
import { ExternalLink } from "../ExternalLink";
import styles from "./SoknadList.module.css";

interface IProps {
  soknad: IPaabegynteSoknad;
}

export function PaabegynteSoknad({ soknad }: IProps) {
  const { tittel, sistEndret: dato, endreLenke } = soknad;
  const { getAppText } = useSanity();

  return (
    <li className={styles.soknadContainer}>
      <article className={styles.soknadContent}>
        <Heading level="3" size="small">
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
        <ExternalLink to={endreLenke} asButtonVariant="secondary" size="small">
          {getAppText("paabegynt-soknad.fortsett-paa-soknaden")}
        </ExternalLink>
      </nav>
    </li>
  );
}
