import { LightBulbIcon } from "@navikt/aksel-icons";
import { Alert, InfoCard } from "@navikt/ds-react";
import { isAfter, subWeeks } from "date-fns";
import styles from "~/components/søknad-liste/SøknadListe.module.css";
import { useSanity } from "~/hooks/useSanity";
import { useTypedRouteLoaderData } from "~/hooks/useTypedRouteLoaderData";
import { ISoknad } from "~/models/hentSøknader.server";
import { hentSøknaderSiste12Uker } from "~/utils/søknad.utils";
import { filtrerSoknaderTilVisning, skalViseSaksbehandlingstid } from "./saksbehandlingstid.utils";
import { NyesteInnsendtSøknadStatus } from "./NyesteInnsendtSøknadStatus";
import { FullførteSøknad } from "./FullførteSøknad";

export function FullførteSøknadListe() {
  const { getAppText } = useSanity();
  const { soknader, aktivDagpengerett } = useTypedRouteLoaderData("root");

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

  const fullforteSoknaderWithin12Weeks = hentSøknaderSiste12Uker(alleSoknader).sort((a, b) => {
    const dateA = new Date(a.innsendtTimestamp);
    const dateB = new Date(b.innsendtTimestamp);
    return dateB.getTime() - dateA.getTime();
  });

  if (fullforteSoknaderWithin12Weeks.length < 1) {
    return null;
  }

  const nyesteInnsendtTidspunkt = new Date(fullforteSoknaderWithin12Weeks[0].innsendtTimestamp);
  const estimertSaksbehandlingstid = 7;
  const nyesteSøknad = isAfter(
    nyesteInnsendtTidspunkt,
    subWeeks(new Date(), estimertSaksbehandlingstid + 2)
  )
    ? fullforteSoknaderWithin12Weeks[0]
    : null;

  const visSaksbehandlingstid = skalViseSaksbehandlingstid(aktivDagpengerett);
  const soknaderTilVisning = filtrerSoknaderTilVisning(
    fullforteSoknaderWithin12Weeks,
    nyesteSøknad,
    visSaksbehandlingstid
  );

  if (soknader.status === "success") {
    return (
      <ul className={styles.søknadListe}>
        {nyesteSøknad && (
          <>
            {visSaksbehandlingstid && (
              <NyesteInnsendtSøknadStatus
                soknad={nyesteSøknad}
                key={nyesteSøknad.søknadId}
                estimertSaksbehandlingstid={estimertSaksbehandlingstid}
              />
            )}
            {visSaksbehandlingstid && (
              <InfoCard data-color="info" className={styles.søknadInfoBox}>
                <InfoCard.Header icon={<LightBulbIcon aria-hidden />}>
                  <InfoCard.Title>Saksbehandlingstid</InfoCard.Title>
                </InfoCard.Header>
                <InfoCard.Content>
                  Vi behandler søknaden din så snart vi kan, og når du har sendt all dokumentasjonen
                  vi trenger. Det er mange søknader som skal behandles nå, og vi beklager
                  ventetiden. Du får beskjed så snart søknaden din er ferdig behandlet.
                </InfoCard.Content>
              </InfoCard>
            )}
          </>
        )}
        {soknaderTilVisning.map((soknad) => (
          <FullførteSøknad soknad={soknad} key={soknad.søknadId} />
        ))}
      </ul>
    );
  }

  return null;
}
