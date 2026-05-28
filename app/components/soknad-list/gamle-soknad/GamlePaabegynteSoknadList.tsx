import { Alert } from "@navikt/ds-react";
import { useRouteLoaderData } from "react-router";
import { useSanity } from "~/hooks/useSanity";
import type { IGamlePaabegynteSoknad } from "~/models/getGamlePaabegynteSoknader.server";
import { GamlePaabegynteSoknad } from "./GamlePaabegynteSoknad";
import styles from "../SoknadList.module.css";
import { ISoknad } from "~/models/getSoknader.server";

export function GamlePaabegynteSoknadList() {
  const { getAppText } = useSanity();
  const { gamlePaabegynteSoknader, soknader } = useRouteLoaderData("root");

  if (gamlePaabegynteSoknader.status === "error") {
    return (
      <Alert variant="error" className={styles.errorContainer}>
        {getAppText("feil-melding.klarte-ikke-hente-paabegynte-soknader")}
      </Alert>
    );
  }

  // Filtrerer ut påbegynte søknader som også finnes i orkestrator-søknader for å unngå duplikate søknader i UI
  const filtrertGamlePaabegynteSoknader = gamlePaabegynteSoknader.data.filter(
    (soknad: IGamlePaabegynteSoknad) =>
      soknad.søknadId &&
      !soknader.data.some(
        (soknadOrkestrator: ISoknad) => soknadOrkestrator.søknadId === soknad.søknadId
      )
  );

  if (gamlePaabegynteSoknader.status === "success" && filtrertGamlePaabegynteSoknader.length > 0) {
    return (
      <ul className={styles.soknadList}>
        {filtrertGamlePaabegynteSoknader.map((soknad: IGamlePaabegynteSoknad) => (
          <GamlePaabegynteSoknad soknad={soknad} key={soknad.søknadId} />
        ))}
      </ul>
    );
  }

  return <></>;
}
