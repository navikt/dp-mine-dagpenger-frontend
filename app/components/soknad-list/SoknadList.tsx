import { Heading } from "@navikt/ds-react";
import { useRouteLoaderData } from "react-router";
import FullforteSoknadFraOrkestratorList from "~/components/soknad-list/FullforteSoknadFraOrkestratorList";
import PaabegynteSoknadFraOrkestratorList from "~/components/soknad-list/PaabegynteSoknadFraOrkestratorList";
import { useSanity } from "~/hooks/useSanity";
import { IOrkestratorSoknad } from "~/models/getOrkestratorSoknader.server";
import {
  getSoknadWithinLast12Weeks,
  getSoknadWithinLast12WeeksOrkestrator,
} from "~/utils/soknad.utils";
import { Section } from "../section/Section";
import { SectionContent } from "../section/SectionContent";
import { FullforteSoknadList } from "./FullforteSoknadList";
import { PaabegynteSoknadList } from "./PaabegynteSoknadList";

export function SoknadList() {
  const { fullforteSoknader, paabegynteSoknader, orkestratorSoknader } = useRouteLoaderData("root");
  const { getAppText } = useSanity();

  const hasFullfortSoknad = fullforteSoknader.status === "success" && fullforteSoknader.data.length;
  const fullfortSoknadFraOrkestrator =
    orkestratorSoknader.data?.filter(
      (soknad: IOrkestratorSoknad) =>
        soknad.status === "INNSENDT" ||
        soknad.status === "JOURNALFØRT" ||
        soknad.status === "GODKJENT"
    ) ?? [];

  const hasPaabegyntSoknad =
    paabegynteSoknader.status === "success" && paabegynteSoknader.data.length;

  const harPaabegyntSoknadFraOrkestrator =
    orkestratorSoknader.data?.filter(
      (soknad: IOrkestratorSoknad) => soknad.status === "PÅBEGYNT"
    ) ?? [];

  const fullforteSoknaderWithin12Weeks = getSoknadWithinLast12Weeks(fullforteSoknader.data ?? []);
  const harFullfortSoknadFraOrkestratorWithin12Weeks = getSoknadWithinLast12WeeksOrkestrator(
    fullfortSoknadFraOrkestrator
  );

  const harIngenSoknader =
    !hasFullfortSoknad &&
    !hasPaabegyntSoknad &&
    !fullfortSoknadFraOrkestrator.length &&
    !harPaabegyntSoknadFraOrkestrator.length;

  const harIngenSoknaderWithin12Weeks =
    !fullforteSoknaderWithin12Weeks.length &&
    !(paabegynteSoknader.data?.length ?? 0) &&
    !harFullfortSoknadFraOrkestratorWithin12Weeks.length &&
    !harPaabegyntSoknadFraOrkestrator.length;

  if (harIngenSoknader || harIngenSoknaderWithin12Weeks) {
    return <></>;
  }

  return (
    <Section highlighted>
      <SectionContent>
        <Heading level="2" size="large" spacing>
          {getAppText("seksjon.mine-soknader.seksjonsbeskrivelse")}
        </Heading>
        <PaabegynteSoknadFraOrkestratorList />
        <PaabegynteSoknadList />
        <FullforteSoknadFraOrkestratorList />
        <FullforteSoknadList />
      </SectionContent>
    </Section>
  );
}
