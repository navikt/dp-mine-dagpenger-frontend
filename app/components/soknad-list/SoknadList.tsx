import { Heading } from "@navikt/ds-react";
import { useSanity } from "~/hooks/useSanity";
import { useTypedRouteLoaderData } from "~/hooks/useTypedRouteLoaderData";
import { Section } from "../section/Section";
import { SectionContent } from "../section/SectionContent";
import { FullforteSoknadList } from "./FullforteSoknadList";
import { PaabegynteSoknadList } from "./PaabegynteSoknadList";

export function SoknadList() {
  const { fullforteSoknader, paabegynteSoknader } = useTypedRouteLoaderData("routes/_index");
  const { getAppText } = useSanity();

  const hasFullfortSoknad = fullforteSoknader.status === "success" && fullforteSoknader.data.length;
  const hasPaabegyntSoknad =
    paabegynteSoknader.status === "success" && paabegynteSoknader.data.length;

  if (!hasFullfortSoknad && !hasPaabegyntSoknad) {
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
