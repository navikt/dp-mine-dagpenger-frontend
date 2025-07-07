import { Alert } from "@navikt/ds-react";
import { useSanity } from "~/hooks/useSanity";
import { useTypedRouteLoaderData } from "~/hooks/useTypedRouteLoaderData";
import { getSoknadWithinLast12Weeks } from "~/utils/soknad.utils";
import { FullforteSoknad } from "./FullforteSoknad";
import styles from "./SoknadList.module.css";

export function FullforteSoknadList() {
  const { getAppText } = useSanity();
  const { fullforteSoknader } = useTypedRouteLoaderData("routes/_index");

  if (fullforteSoknader.status === "error") {
    return (
      <Alert variant="error" className={styles.errorContainer}>
        {getAppText("feil-melding.klarte-ikke-hente-fullforte-soknader")}
      </Alert>
    );
  }
  const fullforteSoknaderWithin12Weeks = getSoknadWithinLast12Weeks(fullforteSoknader.data);

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
