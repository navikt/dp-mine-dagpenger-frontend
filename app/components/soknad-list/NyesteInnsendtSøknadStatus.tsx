import {
  BodyShort,
  Box,
  Heading,
  HStack,
  InfoCard,
  Link,
  ReadMore,
  Tag,
  VStack,
} from "@navikt/ds-react";
import { addWeeks } from "date-fns";
import { Dokumentasjonskrav } from "~/components/dokumentasjon/dokumentasjon.types";
import { DokumentasjonskravInnhold } from "~/components/dokumentasjon/DokumentasjonskravInnhold";
import { ExternalLink } from "~/components/ExternalLink";
import { FormattedDate } from "~/components/FormattedDate";
import styles from "~/components/soknad-list/SoknadList.module.css";
import { useSanity } from "~/hooks/useSanity";
import { ISoknad } from "~/models/hentSøknader.server";
import { getEnv } from "~/utils/env.utils";

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
  const ettersendingFrist = addWeeks(innsendtDato, 2);

  const manglendeDokumentasjonskrav: Dokumentasjonskrav[] =
    soknad.manglendeDokumentasjonskrav.length > 0
      ? soknad.manglendeDokumentasjonskrav.map((krav) => JSON.parse(krav) as Dokumentasjonskrav)
      : [];

  return (
    <div className={styles.soknadContainer}>
      <article className={styles.soknadContent}>
        <Heading level="3" size="small" spacing>
          {tittel}
        </Heading>
        <BodyShort className={styles.soknadDate} size="small">
          Vi har mottatt søknaden din om dagpenger:
        </BodyShort>
        <BodyShort className={styles.soknadStatusDate}>
          <FormattedDate date={innsendtTimestamp} bareDato={true} />
        </BodyShort>
        <BodyShort className={styles.soknadDate} size="small">
          Saksbehandlingstiden er for tiden {estimertSaksbehandlingstid} uker. Derfor tror vi at du
          vil få svar fra oss en gang mellom
        </BodyShort>
        <BodyShort className={styles.soknadStatusDate} spacing>
          <FormattedDate date={estimertSvarFraDato.toString()} bareDato={true} /> {" og "}
          <FormattedDate date={estimertSvarTilDato.toString()} bareDato={true} />
        </BodyShort>

        <ReadMore header="Saksbehandlingstid">
          Vi behandler søknaden din så snart vi kan, og når du har sendt all dokumentasjonen vi
          trenger. Det er mange søknader som skal behandles nå, og vi beklager ventetiden. Du får
          beskjed så snart søknaden din er ferdig behandlet.
        </ReadMore>

        <HStack gap="space-8" className="mt-4">
          <ExternalLink to={ettersendingUrl} asButtonVariant="primary" size="small">
            {getAppText("fullfort-soknad.send-dokumentasjon.knapp-tekst")}
          </ExternalLink>
          <ExternalLink to={kvitteringUrl} asButtonVariant="secondary" size="small">
            {getAppText("fullfort-soknad.se-soknad.knapp-tekst")}
          </ExternalLink>
          <ExternalLink to={nySøknadUrl} asButtonVariant="secondary" size="small">
            Send ny søknad
          </ExternalLink>
        </HStack>

        {manglendeDokumentasjonskrav.length > 0 && (
          <VStack gap="space-16" className="mt-4">
            {manglendeDokumentasjonskrav.map((krav) => (
              <Box key={krav.id} className="mt-4">
                <VStack gap="space-8">
                  <HStack justify="space-between" wrap={false} align="start" gap="space-12">
                    <Heading size="xsmall" level="4">
                      {krav.tittel}
                    </Heading>
                    <Tag variant="warning" size="xsmall">
                      Mangler
                    </Tag>
                  </HStack>
                  <BodyShort color="subtle" size="small">
                    Frist{" "}
                    <FormattedDate
                      date={ettersendingFrist.toString()}
                      bareDato={true}
                      utenÅrstall={true}
                    />
                  </BodyShort>
                  <ReadMore header={"Dette må dokumentasjonen inneholde"}>
                    <DokumentasjonskravInnhold type={krav.type} />
                  </ReadMore>
                </VStack>
              </Box>
            ))}
          </VStack>
        )}

        <InfoCard data-color="info" className={styles.soknadInfoBox}>
          <InfoCard.Header>
            <InfoCard.Title>Har du fått brev om manglende opplysninger?</InfoCard.Title>
          </InfoCard.Header>
          <InfoCard.Content>
            Hvis du har fått brev om manglende opplysninger vil det stå i brevet hva som skal sendes
            inn og frist for å sende inn. Brev du har fått ligger i{" "}
            <Link href="#dokumentliste">dokumentlisten på Mine dagpenger.</Link>
          </InfoCard.Content>
        </InfoCard>

        <nav className={styles.soknadLinksContainerForSkyra}>
          <skyra-survey slug="arbeids-og-velferdsetaten-nav/mine-dagpenger-status-i-sak"></skyra-survey>
        </nav>
      </article>
    </div>
  );
}
