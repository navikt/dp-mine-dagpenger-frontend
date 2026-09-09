import { Heading } from "@navikt/ds-react";
import { useSanity } from "~/hooks/useSanity";
import { AktivDagpengerettAlert } from "../aktiv-dagpengerett/AktivDagpengerettAlert";
import { ArbeidssokerStatus } from "../arbeidssoker-status/ArbeidssokerStatus";
import { Section } from "../section/Section";
import { SectionContent } from "../section/SectionContent";
import { useRouteLoaderData } from "react-router";
import { harAktivDagpengerRett as hentBrukerHarAktivDagpengerRett } from "../aktiv-dagpengerett/aktivDagpengerett.utils";

export function PageHero() {
  const { getAppText } = useSanity();
  const { aktivDagpengerett } = useRouteLoaderData("root");
  const harAktivDagpengerRett = hentBrukerHarAktivDagpengerRett(aktivDagpengerett);

  return (
    <Section>
      <SectionContent>
        <Heading className="page-header" size="xlarge">
          {getAppText("sidetittel")}
        </Heading>
        {harAktivDagpengerRett && <AktivDagpengerettAlert />}
        <ArbeidssokerStatus />
      </SectionContent>
    </Section>
  );
}
