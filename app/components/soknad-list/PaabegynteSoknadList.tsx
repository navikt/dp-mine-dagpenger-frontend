import { Alert } from "@navikt/ds-react";
import { useTypedRouteLoaderData } from "remix-typedjson";
import { useSanity } from "~/hooks/useSanity";
import { IPaabegynteSoknad } from "~/models/getPaabegynteSoknader.server";
import { PaabegynteSoknad } from "./PaabegynteSoknad";
import styles from "./SoknadList.module.css";

export function PaabegynteSoknadList() {
  const { getAppText } = useSanity();
  const { paabegynteSoknader } = useTypedRouteLoaderData("routes/_index");

  if (paabegynteSoknader.status === "error") {
    return (
      <Alert variant="error" className={styles.errorContainer}>
        {getAppText("feil-melding.klarte-ikke-hente-fullforte-soknader")}
      </Alert>
    );
  }

  if (paabegynteSoknader.status === "success" && paabegynteSoknader.data.length > 0) {
    return (
      <ul className={styles.soknadList}>
        {paabegynteSoknader.data.map((soknad: IPaabegynteSoknad) => (
          <PaabegynteSoknad soknad={soknad} key={soknad.søknadId} />
        ))}
      </ul>
    );
  }

  return <></>;
}
