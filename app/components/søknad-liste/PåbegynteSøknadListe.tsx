import { Alert } from "@navikt/ds-react";
import { useRouteLoaderData } from "react-router";
import styles from "~/components/søknad-liste/SøknadListe.module.css";
import { PåbegynteSøknad } from "~/components/søknad-liste/PåbegynteSøknad";
import { useSanity } from "~/hooks/useSanity";
import { ISoknad } from "~/models/hentSøknader.server";
import { hentPåbegynteSøknader } from "~/utils/søknad.utils";

export function PåbegynteSøknadListe() {
  const { getAppText } = useSanity();
  const { soknader } = useRouteLoaderData("root");

  if (soknader.status === "error") {
    return (
      <Alert variant="error" className={styles.errorContainer}>
        {getAppText("feil-melding.klarte-ikke-hente-fullforte-soknader")}
      </Alert>
    );
  }

  const påbegynteSøknader: ISoknad[] = hentPåbegynteSøknader(soknader.data);

  return (
    <>
      {påbegynteSøknader.length > 0 && (
        <ul className={styles.søknadListe}>
          {påbegynteSøknader.map((soknad: ISoknad) => (
            <PåbegynteSøknad søknad={soknad} key={soknad.søknadId} />
          ))}
        </ul>
      )}
    </>
  );
}
