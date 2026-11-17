import { ExclamationmarkTriangleIcon, InformationSquareIcon } from "@navikt/aksel-icons";
import { BodyLong, Box, Heading, InfoCard } from "@navikt/ds-react";
import { useSanity } from "~/hooks/useSanity";
import { useTypedRouteLoaderData } from "~/hooks/useTypedRouteLoaderData";
import { formaterDato } from "~/utils/dato.utils";
import { ExternalLink } from "~/components/ExternalLink";
import styles from "./MeldekortSeksjon.module.css";
import { hentMeldekortForVisning } from "./meldekort.utils";

export default function MeldekortSeksjon() {
  const { getAppText, getLink } = useSanity();
  const { aktivDagpengerett, meldekort, dagensDatoNorge } = useTypedRouteLoaderData("root");
  const sendMeldekortLink = getLink("meldekort.send");

  if (meldekort.status === "error") {
    return null;
  }

  const harAktivDagpengerett = aktivDagpengerett.status === "success" && aktivDagpengerett.data;
  const bodyText = harAktivDagpengerett ? "meldekort.tekstinnhold-2" : "meldekort.tekst-Innhold-1";
  const { sendMeldekortUrl, klartMeldekort, nesteMeldekort } = hentMeldekortForVisning(
    meldekort.data,
    dagensDatoNorge
  );

  return (
    <section className="pageSection">
      <Heading level="2" size="large">
        {getAppText("meldekort.tittel")}
      </Heading>
      {klartMeldekort ? (
        <InfoCard data-color="warning" size="small">
          <InfoCard.Message icon={<ExclamationmarkTriangleIcon aria-hidden />}>
            {getAppText("meldekort.klar-til-innsending")}
          </InfoCard.Message>
        </InfoCard>
      ) : (
        nesteMeldekort && (
          <InfoCard data-color="info" size="small">
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
    </section>
  );
}
