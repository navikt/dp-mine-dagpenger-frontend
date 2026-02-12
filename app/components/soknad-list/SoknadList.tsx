import { Heading } from "@navikt/ds-react";
import { useRouteLoaderData } from "react-router";
import { useSanity } from "~/hooks/useSanity";
import { Section } from "../section/Section";
import { SectionContent } from "../section/SectionContent";
import { FullforteSoknadList } from "./FullforteSoknadList";
import { PaabegynteSoknadList } from "./PaabegynteSoknadList";
import { getSoknadWithinLast12Weeks } from "~/utils/soknad.utils";
import PaabegynteSoknadFraOrkestratorList from "~/components/soknad-list/PaabegynteSoknadFraOrkestratorList";
import FullforteSoknadFraOrkestratorList from "~/components/soknad-list/FullforteSoknadFraOrkestratorList";

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
        <PaabegynteSoknadFraOrkestratorList />
        <PaabegynteSoknadList />

        <FullforteSoknadFraOrkestratorList />
        <FullforteSoknadList />
      </SectionContent>
    </Section>
  );
}
