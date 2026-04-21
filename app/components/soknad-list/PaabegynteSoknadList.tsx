import { Alert } from "@navikt/ds-react";
import { useRouteLoaderData } from "react-router";
import styles from "~/components/soknad-list/SoknadList.module.css";
import { PaabegynteSoknad } from "~/components/soknad-list/PaabegynteSoknad";
import { useSanity } from "~/hooks/useSanity";
import { IOrkestratorSoknad } from "~/models/getSoknader.server";

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

  const paabegynteSoknader: IOrkestratorSoknad[] = soknader.data
    .filter((soknad: IOrkestratorSoknad) => soknad.søknadId)
    .filter((soknad: IOrkestratorSoknad) => soknad.status === "PÅBEGYNT");

  if (soknader.status === "success" && paabegynteSoknader.length > 0) {
    return (
      <ul className={styles.soknadList}>
        {paabegynteSoknader.map((soknad: IOrkestratorSoknad) => (
          <PaabegynteSoknad soknad={soknad} key={soknad.søknadId} />
        ))}
      </ul>
    );
  }

  return <></>;
}
