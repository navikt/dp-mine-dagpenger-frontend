import { BodyShort, Heading, Tag } from "@navikt/ds-react";
import { useSanity } from "~/hooks/useSanity";
import { IOrkestratorSoknad } from "~/models/getOrkestratorSoknader.server";
import { getBrowserEnv } from "~/utils/env.utils";
import { ExternalLink } from "../ExternalLink";
import { FormattedDate } from "../FormattedDate";

import styles from "./SoknadList.module.css";

interface IProps {
  soknad: IOrkestratorSoknad;
}

export function PaabegynteSoknadOrkestrator({ soknad }: IProps) {
  const { tittel, oppdatertTidspunkt } = soknad;
  const soknadUrl = `${getBrowserEnv("VITE_DP_BRUKERDIALOG_URL")}/${soknad.søknadId}/personalia`;

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
