import { Heading } from "@navikt/ds-react";
import { useSanity } from "~/hooks/useSanity";
import { Section } from "../section/Section";
import { SectionContent } from "../section/SectionContent";
import { FullførteSøknadListe } from "./FullførteSøknadListe";
import { PåbegynteSøknadListe } from "./PåbegynteSøknadListe";

export function SøknadListe() {
  const { getAppText } = useSanity();

  return (
    <Section highlighted>
      <SectionContent>
        <Heading level="2" size="large" spacing>
          {getAppText("seksjon.mine-soknader.seksjonsbeskrivelse")}
        </Heading>
        <PåbegynteSøknadListe />
        <FullførteSøknadListe />
      </SectionContent>
    </Section>
  );
}
