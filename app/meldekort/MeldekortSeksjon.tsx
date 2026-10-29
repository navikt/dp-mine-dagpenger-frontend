import { ExclamationmarkTriangleIcon, InformationSquareIcon } from "@navikt/aksel-icons";
import { BodyLong, Box, Heading, InfoCard } from "@navikt/ds-react";
import { useSanity } from "~/hooks/useSanity";
import { useTypedRouteLoaderData } from "~/hooks/useTypedRouteLoaderData";
import { formaterDato } from "~/utils/dato.utils";
import { ExternalLink } from "~/components/ExternalLink";
import { Section } from "~/components/section/Section";
import { SectionContent } from "~/components/section/SectionContent";
import styles from "./MeldekortSeksjon.module.css";

export default function MeldekortSeksjon() {
  const { getAppText, getLink } = useSanity();
  const { aktivDagpengerett, meldekort, dagensDatoNorge } = useTypedRouteLoaderData("root");
  const sendMeldekortLink = getLink("meldekort.send");

  if (meldekort.status === "error") {
    return null;
  }

  const harAktivDagpengerett = aktivDagpengerett.status === "success" && aktivDagpengerett.data;
  const bodyText = harAktivDagpengerett ? "meldekort.tekstinnhold-2" : "meldekort.tekst-Innhold-1";
  const meldekortEtterDato = [...meldekort.data.meldekortTilUtfylling].sort(
    (a, b) => a.kanSendesFra.localeCompare(b.kanSendesFra)
  );
  const sendMeldekortUrl = meldekort.data.redirectUrl?.trim();
  const meldekortKlartEtterDato = meldekortEtterDato.find(
    (kort) => kort.kanSendesFra <= dagensDatoNorge
  );
  const klartMeldekort = Boolean(meldekortKlartEtterDato && sendMeldekortUrl);
  const nesteMeldekort = !meldekortKlartEtterDato
    ? meldekortEtterDato.find((kort) => kort.kanSendesFra > dagensDatoNorge)
    : undefined;

  return (
    <Section>
      <SectionContent>
        <Heading level="2" size="large" spacing>
          {getAppText("meldekort.tittel")}
        </Heading>
        {klartMeldekort ? (
          <InfoCard data-color="warning" className={styles.statusAlert} size="small">
            <InfoCard.Message icon={<ExclamationmarkTriangleIcon aria-hidden />}>
              {getAppText("meldekort.klar-til-innsending")}
            </InfoCard.Message>
          </InfoCard>
        ) : (
          nesteMeldekort && (
            <InfoCard data-color="info" className={styles.statusAlert} size="small">
              <InfoCard.Message icon={<InformationSquareIcon aria-hidden />}>
                {getAppText("meldekort.neste-klar-til-innsending")}{" "}
                {formaterDato(nesteMeldekort.kanSendesFra)}
              </InfoCard.Message>
            </InfoCard>
          )
        )}
        <Box background="neutral-soft" borderRadius="8" padding="space-20">
          <BodyLong spacing>{getAppText(bodyText)}</BodyLong>
          {klartMeldekort && sendMeldekortUrl && (
            <nav className={styles.links}>
              <ExternalLink to={sendMeldekortUrl} asButtonVariant="primary" size="small">
                {sendMeldekortLink.linkText}
              </ExternalLink>
            </nav>
          )}
        </Box>
      </SectionContent>
    </Section>
  );
}
