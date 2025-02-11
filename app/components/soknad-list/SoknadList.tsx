import { Heading } from "@navikt/ds-react";
import { useRouteLoaderData } from "react-router";
import { useSanity } from "~/hooks/useSanity";
import { Section } from "../section/Section";
import { SectionContent } from "../section/SectionContent";
import { FullforteSoknadList } from "./FullforteSoknadList";
import { PaabegynteSoknadList } from "./PaabegynteSoknadList";
import { loader } from "~/routes/index";

export function SoknadList() {
  const loaderData = useRouteLoaderData<typeof loader>("routes/index");
  const { getAppText } = useSanity();

  const fullforteSoknader = loaderData?.fullforteSoknader;
  const paabegynteSoknader = loaderData?.paabegynteSoknader;

  const hasFullfortSoknad =
    fullforteSoknader && fullforteSoknader.status === "success" && fullforteSoknader.data.length;
  const hasPaabegyntSoknad =
    paabegynteSoknader && paabegynteSoknader.status === "success" && paabegynteSoknader.data.length;

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
