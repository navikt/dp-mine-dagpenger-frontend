import { IOrkestratorSoknad } from "~/models/getOrkestratorSoknader.server";
import { useSanity } from "~/hooks/useSanity";
import { getEnv } from "~/utils/env.utils";
import styles from "~/components/soknad-list/SoknadList.module.css";
import { BodyShort, Heading } from "@navikt/ds-react";
import { FormattedDate } from "~/components/FormattedDate";
import { ExternalLink } from "~/components/ExternalLink";

interface IProps {
  soknad: IOrkestratorSoknad;
}

export default function FullforteSoknadFraOrkestrator({ soknad }: IProps) {
  const { søknadId, tittel, innsendtTimestamp } = soknad;
  const { getAppText } = useSanity();

  const ettersendingUrl = `${getEnv("DP_BRUKERDIALOG_URL")}/${søknadId}/ettersending`;
  const kvitteringUrl = `${getEnv("DP_BRUKERDIALOG_URL")}/${søknadId}/kvittering`;

  return (
    <li className={styles.soknadContainer}>
      <article className={styles.soknadContent}>
        <Heading level="3" size="small">
          {tittel}
        </Heading>
        <BodyShort className={styles.soknadDate} size="small">
          {getAppText("fullfort-soknad.sendt-dato.label-tekst")}{" "}
          <FormattedDate date={innsendtTimestamp} />
        </BodyShort>
      </article>
      <nav className={styles.soknadLinksContainer}>
        <ExternalLink to={ettersendingUrl} asButtonVariant="primary" size="small">
          {getAppText("fullfort-soknad.send-dokumentasjon.knapp-tekst")}
        </ExternalLink>
        <ExternalLink to={kvitteringUrl} asButtonVariant="secondary" size="small">
          {getAppText("fullfort-soknad.se-soknad.knapp-tekst")}
        </ExternalLink>
      </nav>
    </li>
  );
}
