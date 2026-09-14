import { ISoknad } from "~/models/getSoknader.server";
import { useSanity } from "~/hooks/useSanity";
import { getEnv } from "~/utils/env.utils";
import styles from "~/components/soknad-list/SoknadList.module.css";
import { BodyShort, Box, Heading, HStack, ReadMore, Tag, VStack } from "@navikt/ds-react";
import { FormattedDate } from "~/components/FormattedDate";
import { ExternalLink } from "~/components/ExternalLink";
import { addWeeks } from "date-fns";
import { Dokumentasjonskrav } from "~/components/dokumentasjon/dokumentasjon.types";
import { DokumentasjonskravInnhold } from "~/components/dokumentasjon/DokumentasjonskravInnhold";

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

  const manglendeDokumentasjonskrav: Dokumentasjonskrav[] =
    soknad.manglendeDokumentasjonskrav.length > 0
      ? soknad.manglendeDokumentasjonskrav.map((krav) => JSON.parse(krav) as Dokumentasjonskrav)
      : [];

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
            Saksbehandlingstiden er for tiden {estimertSaksbehandlingstid} uker. Derfor tror vi at
            du vil få svar fra oss en gang mellom
          </BodyShort>
          <BodyShort className={styles.soknadStatusDate}>
            <FormattedDate date={estimertSvarFraDato.toString()} bareDato={true} /> {" og "}
            <FormattedDate date={estimertSvarTilDato.toString()} bareDato={true} />
          </BodyShort>
        </div>
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
      <VStack padding="space-16" gap="space-16">
        {manglendeDokumentasjonskrav.map((krav) => (
          <Box padding="space-16" key={krav.id} background="sunken" borderRadius="8">
            <VStack gap="space-16">
              <HStack justify="space-between" wrap={false} align="start">
                <Heading size="xsmall" level="4">
                  {krav.tittel}
                </Heading>
                <Tag variant="warning" size="xsmall">
                  Mangler
                </Tag>
              </HStack>
              <ReadMore header={"Dette må dokumentasjonen inneholde"}>
                <DokumentasjonskravInnhold type={krav.type} />
              </ReadMore>
            </VStack>
          </Box>
        ))}
      </VStack>
    </div>
  );
}
