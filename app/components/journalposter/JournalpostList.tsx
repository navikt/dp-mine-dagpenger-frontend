import { Alert, BodyLong, Button, Heading } from "@navikt/ds-react";
import { useState } from "react";
import { useRouteLoaderData } from "react-router";
import { loggKlikkVisAlleDokumenter } from "~/amplitude/amplitude";
import { useSanity } from "~/hooks/useSanity";
import { loader } from "~/routes/index";
import { Section } from "../section/Section";
import { SectionContent } from "../section/SectionContent";
import styles from "./Jounalposter.module.css";
import { JournalpostCard } from "./JournalpostCard";

const NUMBER_OF_DOCUMENTS_TO_SHOW_BY_DEFAULT = 10;

export function JournalpostList() {
  const [showAll, setShowAll] = useState(false);
  const { getAppText } = useSanity();

  const routeData = useRouteLoaderData<typeof loader>("routes/index");

  if (routeData?.journalposter.status === "error") {
    return (
      <Section>
        <SectionContent>
          <Alert variant="error">{getAppText("journalpost.feil-ved-henting-av-dokumenter")}</Alert>
        </SectionContent>
      </Section>
    );
  }

  if (routeData?.journalposter.status === "success" && routeData?.journalposter.data.length === 0) {
    return <></>;
  }

  const journalposter = routeData?.journalposter;

  const journalposterToShow =
    journalposter &&
    routeData?.journalposter.data.slice(
      0,
      showAll ? routeData?.journalposter.data.length : NUMBER_OF_DOCUMENTS_TO_SHOW_BY_DEFAULT
    );

  function onClick() {
    setShowAll(!showAll);
    if (routeData?.journalposter.status === "success" && routeData?.journalposter.data.length) {
      loggKlikkVisAlleDokumenter(routeData?.journalposter.data.length);
    }
  }

  return (
    <Section id="dokumentliste">
      <SectionContent>
        <Heading level="2" size="large" spacing>
          {getAppText("journalpost.seksjonstittel")}
        </Heading>
        <BodyLong spacing>{getAppText("journalpost.seksjonssbeskrivelse")}</BodyLong>
      </SectionContent>
      <SectionContent fullWidth>
        {journalposterToShow &&
          journalposterToShow.map((journalpost) => (
            <JournalpostCard key={journalpost.journalpostId} {...journalpost} />
          ))}
        {!showAll &&
          journalposter &&
          journalposter.data.length > NUMBER_OF_DOCUMENTS_TO_SHOW_BY_DEFAULT && (
            <div className={styles.showAllDocumentButtonContainer}>
              <Button variant="secondary" onClick={onClick}>
                {getAppText("journalpost.vis-alle-dokumenter")} ({journalposter.data.length})
              </Button>
            </div>
          )}
      </SectionContent>
    </Section>
  );
}
