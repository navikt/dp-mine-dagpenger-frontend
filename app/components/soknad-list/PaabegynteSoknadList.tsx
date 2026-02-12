import { Alert } from "@navikt/ds-react";
import { useRouteLoaderData } from "react-router";
import { useSanity } from "~/hooks/useSanity";
import type { IPaabegynteSoknad } from "~/models/getPaabegynteSoknader.server";
import { PaabegynteSoknad } from "./PaabegynteSoknad";
import styles from "./SoknadList.module.css";
import { IOrkestratorSoknad } from "~/models/getOrkestratorSoknader.server";

export function PaabegynteSoknadList() {
  const { getAppText } = useSanity();
  const { paabegynteSoknader, orkestratorSoknader } = useRouteLoaderData("root");

  if (paabegynteSoknader.status === "error") {
    return (
      <Alert variant="error" className={styles.errorContainer}>
        {getAppText("feil-melding.klarte-ikke-hente-paabegynte-soknader")}
      </Alert>
    );
  }

  // Filtrerer ut påbegynte søknader som også finnes i orkestrator-søknader for å unngå duplikate søknader i UI
  const soknader = paabegynteSoknader.data.filter(
    (soknad: IPaabegynteSoknad) =>
      soknad.søknadId &&
      !orkestratorSoknader.data.some(
        (soknadOrkestrator: IOrkestratorSoknad) => soknadOrkestrator.søknadId === soknad.søknadId
      )
  );

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
