import { Heading } from "@navikt/ds-react";
import { useRouteLoaderData } from "react-router";
import { useSanity } from "~/hooks/useSanity";
import { Section } from "../section/Section";
import { SectionContent } from "../section/SectionContent";
import { FullforteSoknadList } from "./FullforteSoknadList";
import { PaabegynteSoknadList } from "./PaabegynteSoknadList";
import { getSoknadWithinLast12Weeks } from "~/utils/soknad.utils";

export function SoknadList() {
  const { fullforteSoknader, paabegynteSoknader } = useRouteLoaderData("root");
  const { getAppText } = useSanity();

  const hasFullfortSoknad = fullforteSoknader.status === "success" && fullforteSoknader.data.length;
  const hasPaabegyntSoknad =
    paabegynteSoknader.status === "success" && paabegynteSoknader.data.length;
  const fullforteSoknaderWithin12Weeks = getSoknadWithinLast12Weeks(fullforteSoknader.data);

  if (!hasFullfortSoknad && !hasPaabegyntSoknad) {
    return <></>;
  }

  if (!fullforteSoknaderWithin12Weeks.length && !paabegynteSoknader.data.length) {
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
