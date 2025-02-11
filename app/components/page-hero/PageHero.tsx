import { Heading } from "@navikt/ds-react";
import { PortableText } from "@portabletext/react";
import { useSanity } from "~/hooks/useSanity";
import { ArbeidssokerStatus } from "../arbeidssoker-status/ArbeidssokerStatus";
import { Section } from "../section/Section";
import { SectionContent } from "../section/SectionContent";
import { getSoknadWithinLast12Weeks } from "~/utils/soknad.utils";
import { useRouteLoaderData } from "react-router";
import { loader } from "~/routes/index";

export function PageHero() {
  const { getRichText, getAppText } = useSanity();
  const routeData = useRouteLoaderData<typeof loader>("routes/index");

  const sectionText = getRichText("soknader");
  const soknader =
    routeData?.fullforteSoknader.status === "success" &&
    getSoknadWithinLast12Weeks(routeData?.fullforteSoknader.data).length > 0;

  return (
    <Section>
      <SectionContent>
        <Heading className="page-header" size="xlarge" data-testid={"page-heading"}>
          {getAppText("sidetittel")}
        </Heading>
        {soknader && <PortableText value={sectionText} />}
        <ArbeidssokerStatus />
      </SectionContent>
    </Section>
  );
}
