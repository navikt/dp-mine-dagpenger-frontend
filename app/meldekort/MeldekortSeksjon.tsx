import { Heading } from "@navikt/ds-react";
import { Section } from "~/components/section/Section";
import { SectionContent } from "~/components/section/SectionContent";

export default function MeldekortSeksjon() {

  return (
    <Section>
      <SectionContent>
        <Heading level="2" size="large" spacing>
          Meldekort
        </Heading>
      </SectionContent>
    </Section>
  );
}