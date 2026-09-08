import { Alert } from "@navikt/ds-react";
import { useRouteLoaderData } from "react-router";
import styles from "~/components/soknad-list/SøknadListe.module.css";
import { PaabegynteSoknad } from "~/components/soknad-list/PaabegynteSoknad";
import { useSanity } from "~/hooks/useSanity";
import { Søknad } from "~/models/getSoknader.server";

export function PaabegynteSoknadList() {
  const { getAppText } = useSanity();
  const { søknader } = useRouteLoaderData("root");

  if (søknader.status === "error") {
    return (
      <Alert variant="error" className={styles.errorContainer}>
        {getAppText("feil-melding.klarte-ikke-hente-fullforte-soknader")}
      </Alert>
    );
  }

  const paabegynteSoknader: Søknad[] = søknader.data
    .filter((soknad: Søknad) => soknad.søknadId)
    .filter((soknad: Søknad) => soknad.status === "PÅBEGYNT");

  if (søknader.status === "success" && paabegynteSoknader.length > 0) {
    return (
      <ul className={styles.soknadList}>
        {paabegynteSoknader.map((soknad: Søknad) => (
          <PaabegynteSoknad soknad={soknad} key={soknad.søknadId} />
        ))}
      </ul>
    );
  }

  return <></>;
}
