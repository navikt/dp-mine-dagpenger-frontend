import { Alert } from "@navikt/ds-react";
import { useRouteLoaderData } from "react-router";
import { useSanity } from "~/hooks/useSanity";
import { getSoknadWithinLast12Weeks } from "~/utils/soknad.utils";
import { GamleFullforteSoknad } from "./GamleFullforteSoknad";
import styles from "../SoknadList.module.css";
import { IOrkestratorSoknad } from "~/models/getSoknader.server";
import { ISoknad } from "~/models/getFullfortSoknader.server";

export function GamleFullforteSoknadList() {
  const { getAppText } = useSanity();
  const { gamleFullforteSoknader, soknader } = useRouteLoaderData("root");

  if (gamleFullforteSoknader.status === "error") {
    return (
      <Alert variant="error" className={styles.errorContainer}>
        {getAppText("feil-melding.klarte-ikke-hente-fullforte-soknader")}
      </Alert>
    );
  }

  // Filtrerer ut fullførte søknader som også finnes i orkestrator-søknader for å unngå duplikate søknader i UI
  const filtrertGamleFullforteSoknader = gamleFullforteSoknader.data.filter(
    (soknad: ISoknad) =>
      soknad.søknadId &&
      !soknader.data.some(
        (soknadOrkestrator: IOrkestratorSoknad) => soknadOrkestrator.søknadId === soknad.søknadId
      )
  );

  const gamleFullforteSoknaderWithin12Weeks = getSoknadWithinLast12Weeks(
    filtrertGamleFullforteSoknader
  );

  if (
    gamleFullforteSoknader.status === "success" &&
    gamleFullforteSoknaderWithin12Weeks.length > 0
  ) {
    return (
      <ul className={styles.soknadList}>
        {gamleFullforteSoknaderWithin12Weeks.map((soknad) => (
          <GamleFullforteSoknad soknad={soknad} key={soknad.søknadId} />
        ))}
      </ul>
    );
  }

  return <></>;
}
