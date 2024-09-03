import { Alert, BodyLong, Button, Heading } from "@navikt/ds-react";
import { useState } from "react";
import { useTypedLoaderData } from "remix-typedjson";
import { useSanity } from "~/hooks/useSanity";
import { loader } from "~/routes/_index";
import { Section } from "../section/Section";
import { SectionContent } from "../section/SectionContent";
import { JournalpostCard } from "./JournalpostCard";
import styles from "./Jounalposter.module.css";

const NUMBER_OF_DOCUMENTS_TO_SHOW_BY_DEFAULT = 10;

export function JournalpostList() {
  const [showAll, setShowAll] = useState(false);
  const { getAppText } = useSanity();

  const { journalposter } = useTypedLoaderData<typeof loader>();

  if (journalposter.status === "error") {
    return (
      <Section>
        <SectionContent>
          <Alert variant="error">{getAppText("journalpost.feil-ved-henting-av-dokumenter")}</Alert>
        </SectionContent>
      </Section>
    );
  }

  if (journalposter.data.length === 0) {
    return <></>;
  }

  const journalposterToShow = journalposter.data.slice(
    0,
    showAll ? journalposter.data.length : NUMBER_OF_DOCUMENTS_TO_SHOW_BY_DEFAULT
  );

  return (
    <Section id="dokumentliste">
      <SectionContent>
        <Heading level="2" size="large" spacing>
          {getAppText("journalpost.seksjonstittel")}
        </Heading>
        <BodyLong spacing>{getAppText("journalpost.seksjonssbeskrivelse")}</BodyLong>
      </SectionContent>
      <SectionContent fullWidth>
        {journalposterToShow.map((journalpost) => (
          <JournalpostCard key={journalpost.journalpostId} {...journalpost} />
        ))}
        {!showAll && journalposter.data.length > NUMBER_OF_DOCUMENTS_TO_SHOW_BY_DEFAULT && (
          <div className={styles.showAllDocumentButtonContainer}>
            <Button variant="secondary" onClick={() => setShowAll(!showAll)}>
              {getAppText("journalpost.vis-alle-dokumenter")} ({journalposter.data.length})
            </Button>
          </div>
        )}
      </SectionContent>
    </Section>
  );
}
