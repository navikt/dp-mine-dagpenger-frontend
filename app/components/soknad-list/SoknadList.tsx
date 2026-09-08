import { Heading } from "@navikt/ds-react";
import { useRouteLoaderData } from "react-router";
import { FullførteSøknadListe } from "~/components/soknad-list/FullforteSoknadList";
import { PaabegynteSoknadList } from "~/components/soknad-list/PaabegynteSoknadList";
import { useSanity } from "~/hooks/useSanity";
import { Søknad } from "~/models/getSoknader.server";
import { hentSøknaderSiste12Uker } from "~/utils/soknad.utils";
import { Section } from "../section/Section";
import { SectionContent } from "../section/SectionContent";

export function SøknadListe() {
  const { getAppText } = useSanity();
  const { søknader } = useRouteLoaderData("root");
  const søknaderData = søknader.data ?? [];
  const harPåbegyntSøknad = søknaderData.some(
    (soknad: Søknad) => soknad.status === "PÅBEGYNT"
  );

  const fullfortSoknader = søknaderData.filter(
    (soknad: Søknad) => soknad.status === "INNSENDT" || soknad.status === "JOURNALFØRT"
  );

  const harFullførtSøknadSiste12Uker = hentSøknaderSiste12Uker(fullfortSoknader);

  if (!harPåbegyntSøknad && harFullførtSøknadSiste12Uker.length === 0) {
    return null;
  }

  return (
    <Section highlighted>
      <SectionContent>
        <Heading level="2" size="large" spacing>
          {getAppText("seksjon.mine-soknader.seksjonsbeskrivelse")}
        </Heading>
        <PaabegynteSoknadList />
        <FullførteSøknadListe />
      </SectionContent>
    </Section>
  );
}
