import { Heading } from "@navikt/ds-react";
import { PortableText } from "@portabletext/react";
import { useTypedLoaderData } from "remix-typedjson";
import { useSanity } from "~/hooks/useSanity";
import { loader } from "~/routes/_index";
import { ArbeidssokerStatus } from "../arbeidssoker-status/ArbeidssokerStatus";
import { Section } from "../section/Section";
import { SectionContent } from "../section/SectionContent";
import { getSoknadWithinLast12Weeks } from "~/utils/soknad.utils";

export function PageHero() {
  const { getRichText, getAppText } = useSanity();
  const { fullforteSoknader } = useTypedLoaderData<typeof loader>();
  const sectionText = getRichText("soknader");
  const soknader =
    fullforteSoknader.status === "success" &&
    getSoknadWithinLast12Weeks(fullforteSoknader.data).length > 0;

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
