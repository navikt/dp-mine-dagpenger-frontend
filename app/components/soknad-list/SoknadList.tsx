import { Alert, Heading } from "@navikt/ds-react";
import { FullforteSoknad } from "~/components/soknad-list/FullforteSoknad";
import { NyesteInnsendtSøknadStatus } from "~/components/soknad-list/NyesteInnsendtSøknadStatus";
import { useSanity } from "~/hooks/useSanity";
import {
  filtrerSoknaderTilVisning,
  finnNyesteSøknadHvisInnenforSaksbehandlingsfrist,
  skalViseSaksbehandlingstid,
} from "~/utils/søknad.utils";
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

  // nyeste innsendt tidspunkt er siste nyeste søknad fra siste 12 uker
  // estimert saksbehandlingstid i uker er satt til 7 uker
  // vise nyeste søknad komponent hvis søknad ble sendt inn innenfor saksbehandlingstid + 2 uker fra i dag
  // vise nyeste komponent hvis aktiv dagpengerett er false
  // vise alle fullførte søknader som vanlig hvis nyeste søknad ikke vises

  // sjekk med AS
  //  const nyesteSøknad = isAfter(
  //    nyesteInnsendtTidspunkt,
  //    subWeeks(new Date(), estimertSaksbehandlingstid + 2)
  //  )
  //    ? fullforteSoknaderWithin12Weeks[0]
  //    : null;

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
