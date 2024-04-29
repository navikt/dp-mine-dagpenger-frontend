import { Heading } from "@navikt/ds-react";
import { useSanity } from "~/hooks/useSanity";
import { useTypedRouteLoaderData } from "~/hooks/useTypedRouteLoaderData";
import { Section } from "../section/Section";
import { SectionContent } from "../section/SectionContent";
import { FullforteSoknader } from "./FullforteSoknader";
import { PaabegynteSoknader } from "./PaabegynteSoknader";

export function Soknader() {
  const { fullforteSoknader, paabegynteSoknader } = useTypedRouteLoaderData("root");
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
        <PaabegynteSoknader />
        <FullforteSoknader />
      </SectionContent>
    </Section>
  );
}
