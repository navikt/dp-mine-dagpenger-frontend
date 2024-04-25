import { Heading } from "@navikt/ds-react";
import { PortableText } from "@portabletext/react";
import { useSanity } from "~/hooks/useSanity";
import { Section } from "../section/Section";
import { SectionContent } from "../section/SectionContent";
import { ArbeidssokerStatus } from "../arbeidssoker-status/ArbeidssokerStatus";
import { useTypedRouteLoaderData } from "~/hooks/useTypedRouteLoaderData";

export function PageHero() {
  const { getRichText, getAppText } = useSanity();
  const { fullforteSoknader } = useTypedRouteLoaderData("routes/_index");
  const sectionText = getRichText("soknader");

  return (
    <Section>
      <SectionContent>
        <Heading className="page-header" size="xlarge">
          {getAppText("sidetittel")}
        </Heading>
        {fullforteSoknader?.length > 0 && <PortableText value={sectionText} />}
        <ArbeidssokerStatus />
      </SectionContent>
    </Section>
  );
}
