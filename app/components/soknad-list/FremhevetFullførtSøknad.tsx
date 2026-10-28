import { BodyShort, Box, Heading, HStack, Link, Process, ReadMore, Tag, VStack } from "@navikt/ds-react";
import classNames from "classnames";
import { addWeeks } from "date-fns";
import { Dokumentasjonskrav } from "~/components/dokumentasjon/dokumentasjon.types";
import { ExternalLink } from "~/components/ExternalLink";
import { FormattedDate } from "~/components/FormattedDate";
import styles from "~/components/soknad-list/SoknadList.module.css";
import { useSanity } from "~/hooks/useSanity";
import { ISoknad } from "~/models/hentSøknader.server";
import { getEnv } from "~/utils/env.utils";
import { formatDate } from "~/utils/formatDate";

interface IProps {
  søknad: ISoknad;
  estimertSaksbehandlingstid: number;
}

export function FremhevetFullførtSøknad({ søknad, estimertSaksbehandlingstid }: IProps) {
  const { søknadId, tittel, innsendtTimestamp } = søknad;
  const { getAppText } = useSanity();

  const ettersendingUrl = `${getEnv("DP_BRUKERDIALOG_URL")}/${søknadId}/ettersending`;
  const kvitteringUrl = `${getEnv("DP_BRUKERDIALOG_URL")}/${søknadId}/kvittering`;
  const innsendtDato = new Date(innsendtTimestamp);
  const estimertSvarFraDato = addWeeks(innsendtDato, estimertSaksbehandlingstid);
  const estimertSvarTilDato = addWeeks(innsendtDato, estimertSaksbehandlingstid + 1);
  const ettersendingFrist = addWeeks(innsendtDato, 2);

  const manglendeDokumentasjonskrav: Dokumentasjonskrav[] =
    søknad.manglendeDokumentasjonskrav.length > 0
      ? søknad.manglendeDokumentasjonskrav.map((krav) => JSON.parse(krav) as Dokumentasjonskrav)
      : [];

  return (
    <article>
      <Box background="neutral-soft" borderRadius="12">
        <VStack gap="space-12" padding="space-20">
          <Heading level="3" size="small">
            {tittel}
          </Heading>
          <Process hideStatusText={true} className={styles.soknadProcess}>
            <Process.Event
              status="completed"
              title={"Vi har mottatt søknaden din"}
              timestamp={formatDate(innsendtTimestamp)}
            >
              <ExternalLink to={kvitteringUrl} asButtonVariant="secondary" size="small">
                {getAppText("fullfort-soknad.se-soknad.knapp-tekst")}
              </ExternalLink>
            </Process.Event>
            {manglendeDokumentasjonskrav.length > 0 ? (
              <Process.Event status="active" title={"Du må sende dokumentasjon"}>
                <BodyShort textColor="subtle" spacing>
                  Vi mangler dokumentasjon for å behandle søknaden din
                </BodyShort>
                <VStack gap="space-8" style={{ marginTop: "var(--ax-space-16)" }}>
                  {manglendeDokumentasjonskrav.map((krav) => (
                    <Box key={krav.id} background="default" padding="space-16" borderRadius="8">
                      <HStack justify="space-between" wrap={false} align="start" gap="space-12">
                        <Heading size="xsmall" level="4">
                          {krav.tittel}
                        </Heading>
                        <Tag variant="warning" size="xsmall">

                        <BodyShort textColor="subtle" size="small" style={{ whiteSpace: "nowrap" }}>
                          Frist{" "}
                          <FormattedDate
                            date={ettersendingFrist.toString()}
                            bareDato={true}
                            utenÅrstall={true}
                          />
                        </BodyShort>
                        </Tag>
                      </HStack>
                    </Box>
                  ))}
                </VStack>
                <ReadMore header="Har du fått brev om manglende dokumentasjon?" style={{ marginTop: "var(--ax-space-16)" }}>
                  Hvis du har fått brev om manglende opplysninger vil det stå i brevet hva som skal
                  sendes inn og frist for å sende inn. Brev du har fått ligger i{" "}
                  <Link href="#dokumentliste">dokumentlisten på Mine dagpenger.</Link>
                </ReadMore>
                <div style={{ marginTop: "var(--ax-space-16)", marginBottom: "var(--ax-space-24)" }}>
                  <ExternalLink to={ettersendingUrl} asButtonVariant="primary" size="small">
                    {getAppText("fullfort-soknad.send-dokumentasjon.knapp-tekst")}
                  </ExternalLink>
                </div>
              </Process.Event>
            ) : <Process.Event
              status={"completed"}
              title={"All dokumentasjon er sendt inn"}
            />}
            <Process.Event
              title={"Venter på ledig saksbehandler"}
            >
              <BodyShort className={styles.soknadDate} size="small">
                Saksbehandlingstiden er for tiden {estimertSaksbehandlingstid} uker. Derfor tror vi at
                du vil få svar fra oss en gang mellom
              </BodyShort>
              <BodyShort className={styles.soknadStatusDate} spacing>
                <FormattedDate date={estimertSvarFraDato.toString()} bareDato={true} /> {" og "}
                <FormattedDate date={estimertSvarTilDato.toString()} bareDato={true} />
              </BodyShort>

              <ReadMore header="Hvorfor tar det så lang tid?">
                Vi behandler søknaden din så snart vi kan, og når du har sendt all dokumentasjonen vi
                trenger. Det er mange søknader som skal behandles nå, og vi beklager ventetiden. Du får
                beskjed så snart søknaden din er ferdig behandlet.
              </ReadMore>
            </Process.Event>
          </Process>
        </VStack>
      </Box>
      <Box
        background="neutral-soft"
        className={classNames({ "mt-1": manglendeDokumentasjonskrav.length > 1 })}
        padding="space-20"
        borderRadius="0 0 12 12"
      >
        <nav className={styles.soknadLinksContainerForSkyra}>
          <skyra-survey slug="arbeids-og-velferdsetaten-nav/mine-dagpenger-status-i-sak" />
        </nav>
      </Box>
    </article>
  );
}
