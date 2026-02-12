import { Alert } from "@navikt/ds-react";
import { useRouteLoaderData } from "react-router";
import styles from "~/components/soknad-list/SoknadList.module.css";
import { PaabegynteSoknadOrkestrator } from "~/components/soknad-list/PaabegynteSoknadOrkestrator";
import { useSanity } from "~/hooks/useSanity";
import { IOrkestratorSoknad } from "~/models/getOrkestratorSoknader.server";

export default function PaabegynteSoknadFraOrkestratorList() {
  const { getAppText } = useSanity();
  const { orkestratorSoknader } = useRouteLoaderData("root");

  if (orkestratorSoknader.status === "error") {
    return (
      <Alert variant="error" className={styles.errorContainer}>
        {getAppText("feil-melding.klarte-ikke-hente-fullforte-soknader")}
      </Alert>
    );
  }

  const soknader: IOrkestratorSoknad[] = orkestratorSoknader.data
    .filter((soknad: IOrkestratorSoknad) => soknad.søknadId)
    .filter((soknad: IOrkestratorSoknad) => soknad.status === "PÅBEGYNT");

  if (orkestratorSoknader.status === "success" && soknader.length > 0) {
    return (
      <ul className={styles.soknadList}>
        {soknader.map((soknad: IOrkestratorSoknad) => (
          <PaabegynteSoknadOrkestrator soknad={soknad} key={soknad.søknadId} />
        ))}
      </ul>
    );
  }

  return <></>;
}
