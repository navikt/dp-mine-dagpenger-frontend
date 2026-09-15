import { Alert, Heading } from "@navikt/ds-react";
import { useRouteLoaderData } from "react-router";
import { FullforteSoknad } from "~/components/soknad-list/FullforteSoknad";
import { NyesteInnsendtSøknadStatus } from "~/components/soknad-list/NyesteInnsendtSøknadStatus";
import { useSanity } from "~/hooks/useSanity";
import { Section } from "../section/Section";
import { SectionContent } from "../section/SectionContent";
import { PaabegynteSoknad } from "./PaabegynteSoknad";
import {
  filtrerSoknaderTilVisning,
  finnNyesteSøknadHvisInnenforSaksbehandlingsfrist,
  skalViseSaksbehandlingstid,
} from "~/utils/søknad.utils";

import styles from "./SoknadList.module.css";

export function SoknadList() {
  const { getAppText } = useSanity();
  const { soknader, aktivDagpengerett } = useRouteLoaderData("root");

  if (soknader.status === "error") {
    return (
      <Alert variant="error" className={styles.errorContainer}>
        {getAppText("feil-melding.klarte-ikke-hente-fullforte-soknader")}
      </Alert>
    );
  }

  const { fullførteSøknader, påbegyntesøknad } = soknader.data;
  const harIngenSøknad = fullførteSøknader.length === 0 && !påbegyntesøknad;

  if (harIngenSøknad) {
    return null;
  }

  const estimertSaksbehandlingstidUker = 7;
  const nyesteSøknad = finnNyesteSøknadHvisInnenforSaksbehandlingsfrist(
    fullførteSøknader[0],
    estimertSaksbehandlingstidUker
  );
  const visSaksbehandlingstid = skalViseSaksbehandlingstid(aktivDagpengerett);
  const soknaderTilVisning = filtrerSoknaderTilVisning(
    fullførteSøknader,
    nyesteSøknad,
    visSaksbehandlingstid
  );

  return (
    <Section>
      <SectionContent>
        <Heading level="2" size="large" spacing>
          {getAppText("seksjon.mine-soknader.seksjonsbeskrivelse")}
        </Heading>
        {påbegyntesøknad && <PaabegynteSoknad soknad={påbegyntesøknad} />}
        <ul className={styles.soknadList}>
          {nyesteSøknad && visSaksbehandlingstid && (
            <NyesteInnsendtSøknadStatus
              key={nyesteSøknad.søknadId}
              soknad={nyesteSøknad}
              estimertSaksbehandlingstid={estimertSaksbehandlingstidUker}
            />
          )}
          {soknaderTilVisning.map((soknad) => (
            <FullforteSoknad soknad={soknad} key={soknad.søknadId} />
          ))}
        </ul>
      </SectionContent>
    </Section>
  );
}
