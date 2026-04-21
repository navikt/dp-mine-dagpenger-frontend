import { useSanity } from "~/hooks/useSanity";
import { useRouteLoaderData } from "react-router";
import { Alert } from "@navikt/ds-react";
import styles from "~/components/soknad-list/SoknadList.module.css";
import { getSoknadWithinLast12WeeksOrkestrator } from "~/utils/soknad.utils";
import { ISoknad } from "~/models/getSoknader.server";
import FullforteSoknad from "~/components/soknad-list/FullforteSoknad";

export default function FullforteSoknadList() {
  const { getAppText } = useSanity();
  const { soknader } = useRouteLoaderData("root");

  if (soknader.status === "error") {
    return (
      <Alert variant="error" className={styles.errorContainer}>
        {getAppText("feil-melding.klarte-ikke-hente-fullforte-soknader")}
      </Alert>
    );
  }

  const alleSoknader = soknader.data
    .filter((soknad: ISoknad) => soknad.søknadId)
    .filter((soknad: ISoknad) => soknad.status === "INNSENDT" || soknad.status === "JOURNALFØRT");

  const fullforteSoknaderWithin12Weeks = getSoknadWithinLast12WeeksOrkestrator(alleSoknader);

  if (soknader.status === "success" && fullforteSoknaderWithin12Weeks.length > 0) {
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
