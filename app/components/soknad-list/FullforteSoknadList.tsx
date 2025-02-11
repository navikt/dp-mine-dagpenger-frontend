import { Alert } from "@navikt/ds-react";
import { useSanity } from "~/hooks/useSanity";
import { getSoknadWithinLast12Weeks } from "~/utils/soknad.utils";
import { FullforteSoknad } from "./FullforteSoknad";
import styles from "./SoknadList.module.css";
import { useRouteLoaderData } from "react-router";
import { loader } from "~/routes/index";

export function FullforteSoknadList() {
  const { getAppText } = useSanity();
  const data = useRouteLoaderData<typeof loader>("routes/index");

  const fullforteSoknader = data?.fullforteSoknader;

  if (fullforteSoknader && fullforteSoknader.status === "error") {
    return (
      <Alert variant="error" className={styles.errorContainer}>
        {getAppText("feil-melding.klarte-ikke-hente-fullforte-soknader")}
      </Alert>
    );
  }
  const fullforteSoknaderWithin12Weeks =
    fullforteSoknader &&
    fullforteSoknader.data &&
    getSoknadWithinLast12Weeks(fullforteSoknader.data);

  if (
    fullforteSoknader &&
    fullforteSoknader.data &&
    fullforteSoknader.status === "success" &&
    fullforteSoknaderWithin12Weeks &&
    fullforteSoknaderWithin12Weeks.length > 0
  ) {
    return (
      <ul className={styles.soknadList}>
        {fullforteSoknaderWithin12Weeks?.map((soknad) => (
          <FullforteSoknad soknad={soknad} key={soknad.søknadId} />
        ))}
      </ul>
    );
  }

  return <></>;
}
