import { useSanity } from "~/hooks/useSanity";
import { useRouteLoaderData } from "react-router";
import { Alert, InfoCard } from "@navikt/ds-react";
import styles from "~/components/soknad-list/SoknadList.module.css";
import { getSoknadWithinLast12WeeksOrkestrator } from "~/utils/soknad.utils";
import { ISoknad } from "~/models/getSoknader.server";
import { FullforteSoknad } from "~/components/soknad-list/FullforteSoknad";
import { isAfter, subWeeks } from "date-fns";
import { NyesteInnsendtSøknadStatus } from "~/components/soknad-list/NyesteInnsendtSøknadStatus";
import { LightBulbIcon } from "@navikt/aksel-icons";
import {
  filtrerSoknaderTilVisning,
  skalViseSaksbehandlingstid,
} from "./saksbehandlingstid.utils";

export function FullforteSoknadList() {
  const { getAppText } = useSanity();
  const { soknader, aktivDagpengerett } = useRouteLoaderData("root");

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

  const fullforteSoknaderWithin12Weeks = getSoknadWithinLast12WeeksOrkestrator(alleSoknader).sort((a, b) => {
    const dateA = new Date(a.innsendtTimestamp);
    const dateB = new Date(b.innsendtTimestamp);
    return dateB.getTime() - dateA.getTime();
  });

  if (fullforteSoknaderWithin12Weeks.length < 1) {
    return null;
  }

  const nyesteInnsendtTidspunkt = new Date(fullforteSoknaderWithin12Weeks[0].innsendtTimestamp);
  const estimertSaksbehandlingstid = 7
  const nyesteSøknad = isAfter(nyesteInnsendtTidspunkt, subWeeks(new Date(), estimertSaksbehandlingstid + 2))
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
      <ul className={styles.soknadList}>
        {
          nyesteSøknad && (
            <>
              {visSaksbehandlingstid && (
                <NyesteInnsendtSøknadStatus
                  soknad={nyesteSøknad}
                  key={nyesteSøknad.søknadId}
                  estimertSaksbehandlingstid={estimertSaksbehandlingstid}
                />
              )}
              {visSaksbehandlingstid && (
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
              )}
            </>
          )
        }
        {soknaderTilVisning.map((soknad) => (
          <FullforteSoknad soknad={soknad} key={soknad.søknadId} />
        ))}
      </ul>
    );
  }

  return null;
}
