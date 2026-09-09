import { ISoknad } from "~/models/hentSøknader.server";
import { useSanity } from "~/hooks/useSanity";
import { getEnv } from "~/utils/env.utils";
import styles from "~/components/søknad-liste/SøknadListe.module.css";
import { BodyShort, Heading, Tag } from "@navikt/ds-react";
import { FormattedDate } from "~/components/FormattedDate";
import { ExternalLink } from "~/components/ExternalLink";
import { addWeeks } from "date-fns";

interface IProps {
  soknad: ISoknad;
  estimertSaksbehandlingstid: number;
}

export function NyesteInnsendtSøknadStatus({ soknad, estimertSaksbehandlingstid }: IProps) {
  const { søknadId, tittel, innsendtTimestamp } = soknad;
  const { getAppText } = useSanity();

  const ettersendingUrl = `${getEnv("DP_BRUKERDIALOG_URL")}/${søknadId}/ettersending`;
  const kvitteringUrl = `${getEnv("DP_BRUKERDIALOG_URL")}/${søknadId}/kvittering`;
  const nySøknadUrl = `${getEnv("DP_BRUKERDIALOG_URL")}`;
  const innsendtDato = new Date(innsendtTimestamp);
  const estimertSvarFraDato = addWeeks(innsendtDato, estimertSaksbehandlingstid);
  const estimertSvarTilDato = addWeeks(innsendtDato, estimertSaksbehandlingstid + 1);

  return (
    <div className={styles.søknadContainer}>
      <article className={styles.søknadContent}>
        <Heading level="3" size="small">
          {tittel}
        </Heading>
        <div className={styles.søknadStatusText}>
          <BodyShort className={styles.søknadDato} size="small">
            Vi har mottatt søknaden din om dagpenger:
          </BodyShort>
          <BodyShort className={styles.søknadStatusDate}>
            <FormattedDate date={innsendtTimestamp} bareDato={true} />
          </BodyShort>
        </div>
        <div>
          <BodyShort className={styles.søknadDato} size="small">
            Saksbehandlingstiden er for tiden {estimertSaksbehandlingstid} uker. Derfor tror vi at
            du vil få svar fra oss en gang mellom
          </BodyShort>
          <BodyShort className={styles.søknadStatusDate}>
            <FormattedDate date={estimertSvarFraDato.toString()} bareDato={true} /> {" og "}
            <FormattedDate date={estimertSvarTilDato.toString()} bareDato={true} />
          </BodyShort>
        </div>
        {soknad.manglendeDokumentasjonskrav.length > 0 && (
          <Tag
            variant="moderate"
            data-color="warning"
            className={styles.søknadDokumentasjonManglerTag}
          >
            Mangler dokumentasjon
          </Tag>
        )}
      </article>
      <nav className={styles.søknadLinksContainer}>
        <ExternalLink to={ettersendingUrl} asButtonVariant="primary" size="small">
          {getAppText("fullfort-soknad.send-dokumentasjon.knapp-tekst")}
        </ExternalLink>
        <ExternalLink to={kvitteringUrl} asButtonVariant="secondary" size="small">
          {getAppText("fullfort-soknad.se-soknad.knapp-tekst")}
        </ExternalLink>
        <ExternalLink to={nySøknadUrl} asButtonVariant="secondary" size="small">
          Send ny søknad
        </ExternalLink>
      </nav>

      <nav className={styles.søknadLinksContainerForSkyra}>
        <skyra-survey slug="arbeids-og-velferdsetaten-nav/mine-dagpenger-status-i-sak"></skyra-survey>
      </nav>
    </div>
  );
}
