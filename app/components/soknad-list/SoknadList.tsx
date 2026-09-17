import { Alert, Heading } from "@navikt/ds-react";
import { isAfter, subWeeks } from "date-fns";
import { FullforteSoknad } from "~/components/soknad-list/FullforteSoknad";
import { FremhevetFullførtSøknad } from "~/components/soknad-list/FremhevetFullførtSøknad";
import { useSanity } from "~/hooks/useSanity";
import { filtrerSøknaderTilVisning } from "~/utils/søknad.utils";
import { Section } from "../section/Section";
import { SectionContent } from "../section/SectionContent";
import { PaabegynteSoknad } from "./PaabegynteSoknad";

import { useTypedRouteLoaderData } from "~/hooks/useTypedRouteLoaderData";
import styles from "./SoknadList.module.css";

export function SoknadList() {
  const { getAppText } = useSanity();
  const { soknader, aktivDagpengerett } = useTypedRouteLoaderData("root");

  if (soknader.status === "error") {
    return (
      <Section>
        <SectionContent>
          <Alert variant="error" className={styles.errorContainer}>
            {getAppText("feil-melding.klarte-ikke-hente-fullforte-soknader")}
          </Alert>
        </SectionContent>
      </Section>
    );
  }

  const { fullførteSøknader, påbegyntesøknad } = soknader.data;
  const harIngenSøknad = fullførteSøknader.length === 0 && !påbegyntesøknad;

  if (harIngenSøknad) {
    return null;
  }

  const estimertSaksbehandlingstidUker = 7;
  const sisteSøknad = fullførteSøknader[0];
  const sisteSøknadErInnenfor9Uker = isAfter(
    new Date(sisteSøknad.innsendtTimestamp),
    subWeeks(new Date(), estimertSaksbehandlingstidUker + 2)
  );
  const visSaksbehandlingstid =
    aktivDagpengerett.status === "error" || aktivDagpengerett.data === false;

  const fremheveSøknad = sisteSøknadErInnenfor9Uker && visSaksbehandlingstid;
  const søknaderTilVisning = filtrerSøknaderTilVisning(fullførteSøknader, fremheveSøknad);

  return (
    <Section>
      <SectionContent>
        <Heading level="2" size="large" spacing>
          {getAppText("seksjon.mine-soknader.seksjonsbeskrivelse")}
        </Heading>
        {påbegyntesøknad && <PaabegynteSoknad soknad={påbegyntesøknad} />}
        <ul className={styles.soknadList}>
          {sisteSøknadErInnenfor9Uker && visSaksbehandlingstid && (
            <FremhevetFullførtSøknad
              key={sisteSøknad.søknadId}
              søknad={sisteSøknad}
              estimertSaksbehandlingstid={estimertSaksbehandlingstidUker}
            />
          )}
          {søknaderTilVisning.map((soknad) => (
            <FullforteSoknad soknad={soknad} key={soknad.søknadId} />
          ))}
        </ul>
      </SectionContent>
    </Section>
  );
}
