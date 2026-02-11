import { Alert } from "@navikt/ds-react";
import { useRouteLoaderData } from "react-router";
import { useSanity } from "~/hooks/useSanity";
import type { IPaabegynteSoknad } from "~/models/getPaabegynteSoknader.server";
import { PaabegynteSoknad } from "./PaabegynteSoknad";
import styles from "./SoknadList.module.css";

export function PaabegynteSoknadList() {
  const { getAppText } = useSanity();
  const { paabegynteSoknader } = useRouteLoaderData("root");

  if (paabegynteSoknader.status === "error") {
    return (
      <Alert variant="error" className={styles.errorContainer}>
        {getAppText("feil-melding.klarte-ikke-hente-fullforte-soknader")}
      </Alert>
    );
  }

  const soknader = paabegynteSoknader.data.filter((soknad: IPaabegynteSoknad) => soknad.søknadId);

  if (paabegynteSoknader.status === "success" && soknader.length > 0) {
    return (
      <ul className={styles.soknadList}>
        {soknader.map((soknad: IPaabegynteSoknad) => (
          <PaabegynteSoknad soknad={soknad} key={soknad.søknadId} />
        ))}
      </ul>
    );
  }

  return <></>;
}
