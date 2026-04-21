import { Heading } from "@navikt/ds-react";
import { useRouteLoaderData } from "react-router";
import FullforteSoknadList from "~/components/soknad-list/FullforteSoknadList";
import PaabegynteSoknadList from "~/components/soknad-list/PaabegynteSoknadList";
import { useSanity } from "~/hooks/useSanity";
import { IOrkestratorSoknad } from "~/models/getSoknader.server";
import {
  getSoknadWithinLast12Weeks,
  getSoknadWithinLast12WeeksOrkestrator,
} from "~/utils/soknad.utils";
import { Section } from "../section/Section";
import { SectionContent } from "../section/SectionContent";
import { GamleFullforteSoknadList } from "./gamle-soknad/GamleFullforteSoknadList";
import { GamlePaabegynteSoknadList } from "./gamle-soknad/GamlePaabegynteSoknadList";

export function SoknadList() {
  const { getAppText } = useSanity();
  const { soknader, gamleFullforteSoknader, gamlePaabegynteSoknader } = useRouteLoaderData("root");
  const harPaabegyntSoknad =
    soknader.data?.filter((soknad: IOrkestratorSoknad) => soknad.status === "PÅBEGYNT") ?? [];

  const fullfortSoknader =
    soknader.data?.filter(
      (soknad: IOrkestratorSoknad) =>
        soknad.status === "INNSENDT" || soknad.status === "JOURNALFØRT"
    ) ?? [];

  const harFullfortSoknadWithin12Weeks = getSoknadWithinLast12WeeksOrkestrator(fullfortSoknader);

  const fullforteGammelSoknaderWithin12Weeks = getSoknadWithinLast12Weeks(
    gamleFullforteSoknader.data ?? []
  );

  const harGamlePaabegynteSoknad =
    gamlePaabegynteSoknader.status === "success" && gamlePaabegynteSoknader.data.length;

  const harGamleFullforteSoknad =
    gamleFullforteSoknader.status === "success" && gamleFullforteSoknader.data.length;

  const harIngenGamleSoknader =
    !harGamleFullforteSoknad &&
    !harGamlePaabegynteSoknad &&
    !fullfortSoknader.length &&
    !harPaabegyntSoknad.length;

  const harIngenSoknaderWithin12Weeks =
    !fullforteGammelSoknaderWithin12Weeks.length &&
    !(gamlePaabegynteSoknader.data?.length ?? 0) &&
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
        <GamlePaabegynteSoknadList />
        <FullforteSoknadList />
        <GamleFullforteSoknadList />
      </SectionContent>
    </Section>
  );
}
