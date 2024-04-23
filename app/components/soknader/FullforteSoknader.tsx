import { BodyShort, Button, Heading } from "@navikt/ds-react";
import { useSanity } from "~/hooks/useSanity";
import { ISoknad } from "~/models/getSoknader.server";
import { getEnv } from "~/utils/env.utils";
import { FormattedDate } from "../FormattedDate";
import { RemixLink } from "../RemixLink";
import styles from "./Soknader.module.css";

interface IProps {
  soknad: ISoknad;
}

export function FullforteSoknader({ soknad }: IProps) {
  const { søknadId, tittel, datoInnsendt, endreLenke, erNySøknadsdialog } = soknad;
  const { getAppText } = useSanity();

  const ettersendingUrl = `${getEnv("DP_SOKNADSDIALOG_URL")}/soknad/${søknadId}/ettersending`;
  const generellInnsendingUrl = `${getEnv("DP_SOKNADSDIALOG_URL")}/generell-innsending`;

  console.log(`🔥 ettersendingUrl :`, ettersendingUrl);
  console.log(`🔥 generellInnsendingUrl :`, generellInnsendingUrl);

  // Sannsynligvis skjer dette kun på papirsøknader
  const fallbackGenerellInnsending = !søknadId && !endreLenke;

  return (
    <li className={styles.soknadContainer}>
      <article className={styles.soknadContent} aria-labelledby={`tittel-${søknadId}`}>
        <Heading level="3" size="small" id={`tittel-${søknadId}`}>
          {tittel}
        </Heading>
        <BodyShort className={styles.soknadDate} size="small">
          {getAppText("fullfort-soknad.sendt-dato.label-tekst")}{" "}
          <FormattedDate date={datoInnsendt} />
        </BodyShort>
      </article>
      <nav className={styles.soknadLinksContainer}>
        {erNySøknadsdialog && (
          <>
            <RemixLink to={ettersendingUrl}>
              <Button variant="primary" size="small">
                {getAppText("fullfort-soknad.send-dokumentasjon.knapp-tekst")}
              </Button>
            </RemixLink>
            <RemixLink to={endreLenke}>
              <Button variant="secondary" size="small">
                {getAppText("fullfort-soknad.se-soknad.knapp-tekst")}
              </Button>
            </RemixLink>
          </>
        )}
        {!erNySøknadsdialog && !fallbackGenerellInnsending && (
          <RemixLink to={endreLenke}>
            <Button variant="primary" size="small">
              {getAppText("fullfort-soknad.send-dokumentasjon.knapp-tekst")}
            </Button>
          </RemixLink>
        )}
        {fallbackGenerellInnsending && (
          <RemixLink to={generellInnsendingUrl}>
            <Button variant="primary" size="small">
              {getAppText("fullfort-soknad.send-dokumentasjon.knapp-tekst")}
            </Button>
          </RemixLink>
        )}
      </nav>
    </li>
  );
}
