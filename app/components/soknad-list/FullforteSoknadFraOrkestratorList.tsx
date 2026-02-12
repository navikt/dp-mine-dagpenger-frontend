import { useSanity } from "~/hooks/useSanity";
import { useRouteLoaderData } from "react-router";
import { Alert } from "@navikt/ds-react";
import styles from "~/components/soknad-list/SoknadList.module.css";
import { getSoknadWithinLast12WeeksOrkestrator } from "~/utils/soknad.utils";
import { IOrkestratorSoknad } from "~/models/getOrkestratorSoknader.server";
import FullforteSoknadFraOrkestrator from "~/components/soknad-list/FullforteSoknadFraOrkestrator";

export default function FullforteSoknadFraOrkestratorList() {
  const { getAppText } = useSanity();
  const { orkestratorSoknader } = useRouteLoaderData("root");

  if (orkestratorSoknader.status === "error") {
    return (
      <Alert variant="error" className={styles.errorContainer}>
        {getAppText("feil-melding.klarte-ikke-hente-fullforte-soknader")}
      </Alert>
    );
  }

  const soknader = orkestratorSoknader.data
    .filter((soknad: IOrkestratorSoknad) => soknad.søknadId)
    .filter(
      (soknad: IOrkestratorSoknad) =>
        soknad.status === "INNSENDT" || soknad.status === "JOURNALFØRT"
    );

  const fullforteSoknaderWithin12Weeks = getSoknadWithinLast12WeeksOrkestrator(soknader);

  if (orkestratorSoknader.status === "success" && fullforteSoknaderWithin12Weeks.length > 0) {
    return (
      <ul className={styles.soknadList}>
        {fullforteSoknaderWithin12Weeks.map((soknad) => (
          <FullforteSoknadFraOrkestrator soknad={soknad} key={soknad.søknadId} />
        ))}
      </ul>
    );
  }

  return <></>;
}
