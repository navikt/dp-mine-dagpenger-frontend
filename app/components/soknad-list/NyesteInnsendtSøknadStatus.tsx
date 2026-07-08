import { ISoknad } from "~/models/getSoknader.server";
import { useSanity } from "~/hooks/useSanity";
import { getEnv } from "~/utils/env.utils";
import styles from "~/components/soknad-list/SoknadList.module.css";
import { BodyShort, Heading, Tag } from "@navikt/ds-react";
import { FormattedDate } from "~/components/FormattedDate";
import { ExternalLink } from "~/components/ExternalLink";
import { addWeeks } from "date-fns";


interface IProps {
  soknad: ISoknad;
}

export function NyesteInnsendtSøknadStatus({ soknad }: IProps) {
  const { søknadId, tittel, innsendtTimestamp } = soknad;
  const { getAppText } = useSanity();

  const ettersendingUrl = `${getEnv("DP_BRUKERDIALOG_URL")}/${søknadId}/ettersending`;
  const kvitteringUrl = `${getEnv("DP_BRUKERDIALOG_URL")}/${søknadId}/kvittering`;
  const nySøknadUrl = `${getEnv("DP_BRUKERDIALOG_URL")}`;
  const innsendtDato = new Date(innsendtTimestamp);
  const estimertSvarFraDato = addWeeks(innsendtDato, 6);
  const estimertSvarTilDato = addWeeks(innsendtDato, 7);

  return (
    <div className={styles.soknadContainer}>
      <article className={styles.soknadContent}>
        <Heading level="3" size="small">
          {tittel}
        </Heading>
        <div className={styles.soknadStatusText}>
          <BodyShort className={styles.soknadDate} size="small">
            Vi har mottatt søknaden din om dagpenger:
          </BodyShort>
          <BodyShort className={styles.soknadStatusDate}>
            <FormattedDate date={innsendtTimestamp} bareDato={true} />
          </BodyShort>
        </div>
        <div>
          <BodyShort className={styles.soknadDate} size="small">
            Saksbehandlingstiden er for tiden 6 uker. Derfor tror vi at du vil få svar fra oss en gang mellom
          </BodyShort>
          <BodyShort className={styles.soknadStatusDate}>
            <FormattedDate date={estimertSvarFraDato.toString()} bareDato={true} /> {" og "}
            <FormattedDate date={estimertSvarTilDato.toString()} bareDato={true} />
          </BodyShort>
        </div>
        {soknad.manglendeDokumentasjonskrav.length > 0 && (
          <Tag variant="moderate" data-color="warning" className={styles.soknadDokumentasjonManglerTag}>
            Mangler dokumentasjon
          </Tag>
        )}
      </article>
      <nav className={styles.soknadLinksContainer}>
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

      <nav className={styles.soknadLinksContainerForSkyra}>
        <skyra-survey slug="arbeids-og-velferdsetaten-nav/mine-dagpenger-status-i-sak"></skyra-survey>
      </nav>
    </div>
  );

}