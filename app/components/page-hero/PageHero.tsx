import { Heading } from "@navikt/ds-react";
import { useSanity } from "~/hooks/useSanity";
import { AktivDagpengerettAlert } from "../aktiv-dagpengerett/AktivDagpengerettAlert";
import { ArbeidssokerStatus } from "../arbeidssoker-status/ArbeidssokerStatus";
import { Section } from "../section/Section";
import { SectionContent } from "../section/SectionContent";

export function PageHero() {
  const { getAppText } = useSanity();

  return (
    <Section>
      <SectionContent>
        <Heading className="page-header" size="xlarge" data-testid={"page-heading"}>
          {getAppText("sidetittel")}
        </Heading>
        <AktivDagpengerettAlert />
        <ArbeidssokerStatus />
      </SectionContent>
    </Section>
  );
}
