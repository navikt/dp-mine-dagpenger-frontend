import { Alert } from "@navikt/ds-react";
import { useSanity } from "~/hooks/useSanity";
import { useTypedRouteLoaderData } from "~/hooks/useTypedRouteLoaderData";
import { withinLast12Weeks } from "~/utils/soknad.utils";
import { FullforteSoknad } from "./FullforteSoknad";
import styles from "./Soknader.module.css";

export function FullforteSoknader() {
  const { getAppText } = useSanity();
  const { fullforteSoknader } = useTypedRouteLoaderData("root");

  if (fullforteSoknader.status === "error") {
    return (
      <Alert variant="error" className={styles.errorContainer}>
        {getAppText("feil-melding.klarte-ikke-hente-fullforte-soknader")}
      </Alert>
    );
  }

  if (fullforteSoknader.status === "success" && fullforteSoknader.data.length > 0) {
    const fullforteSoknaderWithin12Weeks = fullforteSoknader.data?.filter((soknad) =>
      withinLast12Weeks(soknad?.datoInnsendt)
    );

    return (
      <ul className={styles.soknader}>
        {fullforteSoknaderWithin12Weeks.map((soknad) => (
          <FullforteSoknad soknad={soknad} key={soknad.søknadId} />
        ))}
      </ul>
    );
  }

  return <></>;
}
