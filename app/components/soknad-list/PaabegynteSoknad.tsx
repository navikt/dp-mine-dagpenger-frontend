import { BodyShort, Heading, Tag } from "@navikt/ds-react";
import { useSanity } from "~/hooks/useSanity";
import { FormattedDate } from "../FormattedDate";
import { ExternalLink } from "../ExternalLink";
import styles from "./SoknadList.module.css";
import { IOrkestratorSoknad } from "~/models/getSoknader.server";
import { getEnv } from "~/utils/env.utils";

interface IProps {
  soknad: IOrkestratorSoknad;
}

export function PaabegynteSoknad({ soknad }: IProps) {
  const { tittel, oppdatertTidspunkt } = soknad;
  const soknadUrl = `${getEnv("DP_BRUKERDIALOG_URL")}/${soknad.søknadId}/personalia`;

  const { getAppText } = useSanity();

  return (
    <li className={styles.soknadContainer}>
      <article className={styles.soknadContent}>
        <Heading level="3" size="small">
          {tittel} {getAppText("paabegynt-soknad.paabegynt-status")}
        </Heading>
        <BodyShort className={styles.soknadDate} size="small">
          {getAppText("paabegynt-soknad.sist-endret.label-tekst")}
          <FormattedDate date={oppdatertTidspunkt} />
        </BodyShort>
        <Tag variant="neutral" size="small" className="mt-4">
          {getAppText("paabegynt-soknad.soknad-er-ikke-sendt-inn")}
        </Tag>
      </article>
      <nav className={styles.soknadLinksContainer}>
        <ExternalLink to={soknadUrl} asButtonVariant="secondary" size="small">
          {getAppText("paabegynt-soknad.fortsett-paa-soknaden")}
        </ExternalLink>
      </nav>
    </li>
  );
}
