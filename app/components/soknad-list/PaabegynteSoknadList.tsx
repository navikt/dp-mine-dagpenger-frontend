import { Alert } from "@navikt/ds-react";
import { useSanity } from "~/hooks/useSanity";
import { useTypedRouteLoaderData } from "~/hooks/useTypedRouteLoaderData";
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
        {paabegynteSoknader.data.map((soknad) => (
          <PaabegynteSoknad soknad={soknad} key={soknad.søknadId} />
        ))}
      </ul>
    );
  }

  return <></>;
}
