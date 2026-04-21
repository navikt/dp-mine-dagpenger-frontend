import { Alert } from "@navikt/ds-react";
import { useRouteLoaderData } from "react-router";
import styles from "~/components/soknad-list/SoknadList.module.css";
import { PaabegynteSoknad } from "~/components/soknad-list/PaabegynteSoknad";
import { useSanity } from "~/hooks/useSanity";
import { ISoknad } from "~/models/getSoknader.server";

export default function PaabegynteSoknadList() {
  const { getAppText } = useSanity();
  const { soknader } = useRouteLoaderData("root");

  if (soknader.status === "error") {
    return (
      <Alert variant="error" className={styles.errorContainer}>
        {getAppText("feil-melding.klarte-ikke-hente-fullforte-soknader")}
      </Alert>
    );
  }

  const paabegynteSoknader: ISoknad[] = soknader.data
    .filter((soknad: ISoknad) => soknad.søknadId)
    .filter((soknad: ISoknad) => soknad.status === "PÅBEGYNT");

  if (soknader.status === "success" && paabegynteSoknader.length > 0) {
    return (
      <ul className={styles.soknadList}>
        {paabegynteSoknader.map((soknad: ISoknad) => (
          <PaabegynteSoknad soknad={soknad} key={soknad.søknadId} />
        ))}
      </ul>
    );
  }

  return <></>;
}
