import { Heading, LocalAlert } from "@navikt/ds-react";
import { FullforteSoknad } from "~/components/soknad-list/FullforteSoknad";
import { FremhevetFullførtSøknad } from "~/components/soknad-list/FremhevetFullførtSøknad";
import { useSanity } from "~/hooks/useSanity";
import {
  sisteSøknadErInnenforUker,
  filtrerSøknaderTilVisning,
  skalViseSaksbehandlingstid,
} from "~/utils/søknad.utils";
import { Section } from "../section/Section";
import { SectionContent } from "../section/SectionContent";
import { PaabegynteSoknad } from "./PaabegynteSoknad";

import { useTypedRouteLoaderData } from "~/hooks/useTypedRouteLoaderData";
import styles from "./SoknadList.module.css";

export function SoknadList() {
  const { getAppText } = useSanity();
  const { søknader, aktivDagpengerett } = useTypedRouteLoaderData("root");

  if (søknader.status === "error") {
    return (
      <Section>
        <SectionContent>
          <LocalAlert status="error" className={styles.errorContainer}>
            {getAppText("feil-melding.klarte-ikke-hente-fullforte-søknader")}
          </LocalAlert>
        </SectionContent>
      </Section>
    );
  }

  const { fullførteSøknader, påbegyntesøknad } = søknader.data;

  if (fullførteSøknader.length === 0 && !påbegyntesøknad) {
    return null;
  }

  const estimertSaksbehandlingstidUker = 6;
  const sisteSøknad = fullførteSøknader[0] ?? null;
  const harIkkeVedtak = sisteSøknad?.søknadVedtak === null;
  const visSaksbehandlingstid = skalViseSaksbehandlingstid(aktivDagpengerett);
  const fremheveSøknad =
    visSaksbehandlingstid &&
    harIkkeVedtak &&
    sisteSøknadErInnenforUker(sisteSøknad, estimertSaksbehandlingstidUker + 2);

  const søknaderTilVisning = filtrerSøknaderTilVisning(fullførteSøknader, fremheveSøknad);

  return (
    <Section>
      <SectionContent>
        <Heading level="2" size="large" spacing>
          {getAppText("seksjon.mine-soknader.seksjonsbeskrivelse")}
        </Heading>
        {påbegyntesøknad && <PaabegynteSoknad soknad={påbegyntesøknad} />}
        <ul className={styles.soknadList}>
          {sisteSøknad && fremheveSøknad && (
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
