import { Heading } from "@navikt/ds-react";
import { PortableText } from "@portabletext/react";
import { useSanity } from "~/hooks/useSanity";
import { useTypedRouteLoaderData } from "~/hooks/useTypedRouteLoaderData";
import { getSoknadWithinLast12Weeks } from "~/utils/soknad.utils";
import { ArbeidssokerStatus } from "../arbeidssoker-status/ArbeidssokerStatus";
import { Section } from "../section/Section";
import { SectionContent } from "../section/SectionContent";

export function PageHero() {
  const { getRichText, getAppText } = useSanity();
  const { fullforteSoknader } = useTypedRouteLoaderData("routes/_index");
  const sectionText = getRichText("soknader");
  const soknader =
    fullforteSoknader.status === "success" &&
    getSoknadWithinLast12Weeks(fullforteSoknader.data).length > 0;

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
