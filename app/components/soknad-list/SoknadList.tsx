import { Alert, Heading } from "@navikt/ds-react";
import { FullforteSoknad } from "~/components/soknad-list/FullforteSoknad";
import { FremhevetFullførtSøknad } from "~/components/soknad-list/FremhevetFullførtSøknad";
import { useSanity } from "~/hooks/useSanity";
import {
  erSisteSøknadInnenforUker,
  filtrerSøknaderTilVisning,
  hentSisteSøknad,
  skalViseSaksbehandlingstid,
} from "~/utils/søknad.utils";
import { PaabegynteSoknad } from "./PaabegynteSoknad";

import { useTypedRouteLoaderData } from "~/hooks/useTypedRouteLoaderData";
import styles from "./SoknadList.module.css";

export function SoknadList() {
  const { getAppText } = useSanity();
  const { soknader, aktivDagpengerett } = useTypedRouteLoaderData("root");

  if (soknader.status === "error") {
    return (
      <section className="pageSection">
        <Alert variant="error">
          {getAppText("feil-melding.klarte-ikke-hente-fullforte-soknader")}
        </Alert>
      </section>
    );
  }

  const { fullførteSøknader, påbegyntesøknad } = soknader.data;
  const harIngenSøknad = fullførteSøknader.length === 0 && !påbegyntesøknad;

  if (harIngenSøknad) {
    return null;
  }

  const estimertSaksbehandlingstidUker = 6;
  const sisteSøknad = hentSisteSøknad(fullførteSøknader);
  const visSaksbehandlingstid = skalViseSaksbehandlingstid(aktivDagpengerett);
  const sisteSøknadErInnenforSaksbehandlingstid = erSisteSøknadInnenforUker(
    sisteSøknad,
    estimertSaksbehandlingstidUker + 2
  );
  const harIkkeVedtak = sisteSøknad?.søknadVedtak === null ;
  const fremheveSøknad = sisteSøknadErInnenforSaksbehandlingstid && visSaksbehandlingstid && harIkkeVedtak;
  const søknaderTilVisning = filtrerSøknaderTilVisning(fullførteSøknader, fremheveSøknad);

  return (
    <section className="pageSection">
      <Heading level="2" size="large">
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
    </section>
  );
}
