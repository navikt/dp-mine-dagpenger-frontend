import { Heading } from "@navikt/ds-react";
import { useRouteLoaderData } from "react-router";
import { FullforteSoknadList } from "~/components/soknad-list/FullforteSoknadList";
import { PaabegynteSoknadList } from "~/components/soknad-list/PaabegynteSoknadList";
import { useSanity } from "~/hooks/useSanity";
import { ISoknad } from "~/models/getSoknader.server";
import { getSoknadWithinLast12WeeksOrkestrator } from "~/utils/soknad.utils";
import { Section } from "../section/Section";
import { SectionContent } from "../section/SectionContent";

export function SoknadList() {
  const { getAppText } = useSanity();
  const { soknader } = useRouteLoaderData("root");
  const harPaabegyntSoknad =
    soknader.data?.filter((soknad: ISoknad) => soknad.status === "PÅBEGYNT") ?? [];

  const fullfortSoknader =
    soknader.data?.filter(
      (soknad: ISoknad) => soknad.status === "INNSENDT" || soknad.status === "JOURNALFØRT"
    ) ?? [];

  const harFullfortSoknadWithin12Weeks = getSoknadWithinLast12WeeksOrkestrator(fullfortSoknader);

  const harIngenSoknader = !fullfortSoknader.length && !harPaabegyntSoknad.length;

  const harIngenSoknaderDeSiste12Ukene =
    !harFullfortSoknadWithin12Weeks.length && !harPaabegyntSoknad.length;

  if (harIngenSoknader || harIngenSoknaderDeSiste12Ukene) {
    return <></>;
  }

  return (
    <Section highlighted>
      <SectionContent>
        <Heading level="2" size="large" spacing>
          {getAppText("seksjon.mine-soknader.seksjonsbeskrivelse")}
        </Heading>
        <PaabegynteSoknadList />
        <FullforteSoknadList />
      </SectionContent>
    </Section>
  );
}
