import { Heading } from "@navikt/ds-react";
import { PortableText } from "@portabletext/react";
import { useSanity } from "~/hooks/useSanity";
import { Section } from "../section/Section";
import { SectionContent } from "../section/SectionContent";
import { ArbeidssokerStatus } from "../arbeidssoker-status/ArbeidssokerStatus";
import { useTypedRouteLoaderData } from "~/hooks/useTypedRouteLoaderData";

export function PageHero() {
  const { getRichText, getAppText } = useSanity();
  const { fullforteSoknader } = useTypedRouteLoaderData("root");
  const sectionText = getRichText("soknader");

  const soknader = fullforteSoknader.status === "success" && fullforteSoknader.data?.length > 0;

  return (
    <Section>
      <SectionContent>
        <Heading className="page-header" size="xlarge">
          {getAppText("sidetittel")}
        </Heading>
        {soknader && <PortableText value={sectionText} />}
        <ArbeidssokerStatus />
      </SectionContent>
    </Section>
  );
}
