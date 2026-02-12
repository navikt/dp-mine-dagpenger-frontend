import { useSanity } from "~/hooks/useSanity";
import { useRouteLoaderData } from "react-router";
import { Alert } from "@navikt/ds-react";
import styles from "~/components/soknad-list/SoknadList.module.css";
import { IOrkestratorSoknad, ISoknadResponse } from "~/models/getOrkestratorSoknader.server";
import { PaabegynteSoknadOrkestrator } from "~/components/soknad-list/PaabegynteSoknadOrkestrator";
import { getEnv } from "~/utils/env.utils";

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
    .filter((søknad: ISoknadResponse) => søknad.status === "PÅBEGYNT")
    .filter((soknad: ISoknadResponse) => soknad.søknadId)
    .map((soknad: ISoknadResponse) => ({
      ...soknad,
      endreLenke: `${getEnv("DP_BRUKERDIALOG_URL")}/${soknad.søknadId}/personalia`,
    }));

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