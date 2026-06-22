import { Heading } from "@navikt/ds-react";
import { useRouteLoaderData } from "react-router";
import { FullforteSoknadList } from "~/components/soknad-list/FullforteSoknadList";
import { PaabegynteSoknadList } from "~/components/soknad-list/PaabegynteSoknadList";
import { useSanity } from "~/hooks/useSanity";
import { ISoknad } from "~/models/getSoknader.server";
import {
  getSoknadWithinLast6Weeks,
  getSoknadWithinLast12WeeksOrkestrator,
} from "~/utils/soknad.utils";
import { Section } from "../section/Section";
import { SectionContent } from "../section/SectionContent";
import { GamleFullforteSoknadList } from "./gamle-soknad/GamleFullforteSoknadList";

export function SoknadList() {
  const { getAppText } = useSanity();
  const { soknader, gamleFullforteSoknader } = useRouteLoaderData("root");
  const harPaabegyntSoknad =
    soknader.data?.filter((soknad: ISoknad) => soknad.status === "PÅBEGYNT") ?? [];

  const fullfortSoknader =
    soknader.data?.filter(
      (soknad: ISoknad) => soknad.status === "INNSENDT" || soknad.status === "JOURNALFØRT"
    ) ?? [];

  const harFullfortSoknadWithin12Weeks = getSoknadWithinLast12WeeksOrkestrator(fullfortSoknader);

  const fullforteGammelSoknaderWithin12Weeks = getSoknadWithinLast6Weeks(
    gamleFullforteSoknader.data ?? []
  );

  const harGamleFullforteSoknad =
    gamleFullforteSoknader.status === "success" && gamleFullforteSoknader.data.length;

  const harIngenGamleSoknader =
    !harGamleFullforteSoknad &&
    !fullfortSoknader.length &&
    !harPaabegyntSoknad.length;

  const harIngenSoknaderWithin12Weeks =
    !fullforteGammelSoknaderWithin12Weeks.length &&
    !harFullfortSoknadWithin12Weeks.length &&
    !harPaabegyntSoknad.length;

  if (harIngenGamleSoknader || harIngenSoknaderWithin12Weeks) {
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
        <GamleFullforteSoknadList />
      </SectionContent>
    </Section>
  );
}
