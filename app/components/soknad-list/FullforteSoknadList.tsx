import { Alert } from "@navikt/ds-react";
import { useRouteLoaderData } from "react-router";
import { useSanity } from "~/hooks/useSanity";
import { getSoknadWithinLast12Weeks } from "~/utils/soknad.utils";
import { FullforteSoknad } from "./FullforteSoknad";
import styles from "./SoknadList.module.css";
import { IOrkestratorSoknad } from "~/models/getOrkestratorSoknader.server";
import { ISoknad } from "~/models/getFullfortSoknader.server";

export function FullforteSoknadList() {
  const { getAppText } = useSanity();
  const { fullforteSoknader, orkestratorSoknader } = useRouteLoaderData("root");

  if (fullforteSoknader.status === "error") {
    return (
      <Alert variant="error" className={styles.errorContainer}>
        {getAppText("feil-melding.klarte-ikke-hente-fullforte-soknader")}
      </Alert>
    );
  }

  // Filtrerer ut fullførte søknader som også finnes i orkestrator-søknader for å unngå duplikate søknader i UI
  const soknader = fullforteSoknader.data.filter(
    (soknad: ISoknad) =>
      soknad.søknadId &&
      !orkestratorSoknader.data.some(
        (soknadOrkestrator: IOrkestratorSoknad) => soknadOrkestrator.søknadId === soknad.søknadId
      )
  );

  const fullforteSoknaderWithin12Weeks = getSoknadWithinLast12Weeks(soknader);

  if (fullforteSoknader.status === "success" && fullforteSoknaderWithin12Weeks.length > 0) {
    return (
      <ul className={styles.soknadList}>
        {fullforteSoknaderWithin12Weeks.map((soknad) => (
          <FullforteSoknad soknad={soknad} key={soknad.søknadId} />
        ))}
      </ul>
    );
  }

  return <></>;
}
