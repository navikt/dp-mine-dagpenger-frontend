import { useSanity } from "~/hooks/useSanity";
import { useRouteLoaderData } from "react-router";
import { Alert, InfoCard } from "@navikt/ds-react";
import styles from "~/components/soknad-list/SøknadListe.module.css";
import { FullforteSoknad } from "~/components/soknad-list/FullforteSoknad";
import { NyesteInnsendtSøknadStatus } from "~/components/soknad-list/NyesteInnsendtSøknadStatus";
import { LightBulbIcon } from "@navikt/aksel-icons";
import { finnFullførteSøknaderTilVisning } from "./saksbehandlingstid.utils";

export function FullførteSøknadListe() {
  const { getAppText } = useSanity();
  const { søknader, aktivDagpengerett } = useRouteLoaderData("root");

  if (søknader.status === "error") {
    return (
      <Alert variant="error" className={styles.errorContainer}>
        {getAppText("feil-melding.klarte-ikke-hente-fullforte-soknader")}
      </Alert>
    );
  }

  const søknadsData = finnFullførteSøknaderTilVisning(
    søknader.data,
    aktivDagpengerett
  );

  if (!søknadsData) {
    return null;
  }

  const {
    estimertSaksbehandlingstid,
    nyesteSøknad,
    søknaderTilVisning,
    visSaksbehandlingstid,
  } = søknadsData;

  return (
    <ul className={styles.soknadList}>
      {nyesteSøknad && visSaksbehandlingstid && (
        <>
          <NyesteInnsendtSøknadStatus
            soknad={nyesteSøknad}
            key={nyesteSøknad.søknadId}
            estimertSaksbehandlingstid={estimertSaksbehandlingstid}
          />
          <InfoCard data-color="info" className={styles.soknadInfoBox}>
            <InfoCard.Header icon={<LightBulbIcon aria-hidden />}>
              <InfoCard.Title>Saksbehandlingstid</InfoCard.Title>
            </InfoCard.Header>
            <InfoCard.Content>
              Vi behandler søknaden din så snart vi kan, og når du har sendt all dokumentasjonen
              vi trenger. Det er mange søknader som skal behandles nå, og vi beklager ventetiden.
              Du får beskjed så snart søknaden din er ferdig behandlet.
            </InfoCard.Content>
          </InfoCard>
        </>
      )}
      {søknaderTilVisning.map((søknad) => (
        <FullforteSoknad soknad={søknad} key={søknad.søknadId} />
      ))}
    </ul>
  );
}
