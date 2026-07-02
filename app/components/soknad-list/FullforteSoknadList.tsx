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

export function FullforteSoknadList() {
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

  const fullforteSoknaderWithin12Weeks = getSoknadWithinLast12WeeksOrkestrator(alleSoknader).sort((a, b) => {
    const dateA = new Date(a.innsendtTimestamp);
    const dateB = new Date(b.innsendtTimestamp);
    return dateB.getTime() - dateA.getTime();
  });

  if (fullforteSoknaderWithin12Weeks.length < 1) {
    return <></>;
  }

  const nyesteSøknad = isAfter(new Date(fullforteSoknaderWithin12Weeks[0].innsendtTimestamp), subWeeks(new Date(), 8))
    ? fullforteSoknaderWithin12Weeks[0]
    : null;


  if (soknader.status === "success") {
    return (
      <ul className={styles.soknadList}>
        {
          nyesteSøknad ? (
            <>
              <NyesteInnsendtSøknadStatus soknad={nyesteSøknad} key={nyesteSøknad.søknadId} />
              <InfoCard data-color="info" className={styles.soknadInfoBox}>
                <InfoCard.Header icon={<LightBulbIcon aria-hidden />}>
                  <InfoCard.Title>Saksbehandlingstid</InfoCard.Title>
                </InfoCard.Header>
                <InfoCard.Content>
                  En vanlig grunn til lang saksbehandlingstid er at vi ikke har fått all dokumentasjonen
                  vi trenger fra deg. Du kan gjerne dobbeltsjekke at du har sendt inn alt vi trenger.
                </InfoCard.Content>
              </InfoCard>
            </>
          ) : null
        }
        {fullforteSoknaderWithin12Weeks.filter(soknad => soknad.søknadId != nyesteSøknad?.søknadId).map((soknad) => (
          <FullforteSoknad soknad={soknad} key={soknad.søknadId} />
        ))}
      </ul>
    );
  }

  return <></>;
}
