import { BodyShort, Heading, Tag } from "@navikt/ds-react";
import { useSanity } from "~/hooks/useSanity";
import { FormattedDate } from "../FormattedDate";
import { ExternalLink } from "../ExternalLink";
import styles from "./søknadListe.module.css";
import { ISoknad } from "~/models/hentSøknader.server";
import { getEnv } from "~/utils/env.utils";

interface IProps {
  søknad: ISoknad;
}

export function PåbegynteSøknad({ søknad }: IProps) {
  const { tittel, oppdatertTidspunkt } = søknad;
  const søknadUrl = `${getEnv("DP_BRUKERDIALOG_URL")}/${søknad.søknadId}/personalia`;

  const { getAppText } = useSanity();

  return (
    <li className={styles.søknadContainer}>
      <article className={styles.søknadContent}>
        <Heading level="3" size="small">
          {tittel} {getAppText("paabegynt-soknad.paabegynt-status")}
        </Heading>
        <BodyShort className={styles.søknadDato} size="small">
          {getAppText("paabegynt-soknad.sist-endret.label-tekst")}
          <FormattedDate date={oppdatertTidspunkt} />
        </BodyShort>
        <Tag variant="neutral" size="small" className="mt-4">
          {getAppText("paabegynt-soknad.soknad-er-ikke-sendt-inn")}
        </Tag>
      </article>
      <nav className={styles.søknadLinksContainer}>
        <ExternalLink to={søknadUrl} asButtonVariant="secondary" size="small">
          {getAppText("paabegynt-soknad.fortsett-paa-soknaden")}
        </ExternalLink>
      </nav>
    </li>
  );
}
