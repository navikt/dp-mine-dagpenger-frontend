import { Alert, Heading } from "@navikt/ds-react";
import { useSanity } from "~/hooks/useSanity";
import { useTypedRouteLoaderData } from "~/hooks/useTypedRouteLoaderData";
import { Section } from "../section/Section";
import { SectionContent } from "../section/SectionContent";
// import { FullforteSoknader } from "./FullforteSoknader";
// import { PaabegynteSoknader } from "./PaabegynteSoknader";
import styles from "./Soknader.module.css";
import { within12Weeks } from "~/utils/soknad.utils";
// import { IPaabegynteSoknad, ISoknad } from "~/models/getSoknader.server";

export function Soknader() {
  const { fullforteSoknader, paabegynteSoknader } = useTypedRouteLoaderData("routes/_index");
  const { getAppText } = useSanity();

  const fullforteSoknaderWithin12Weeks = fullforteSoknader?.filter((soknad) =>
    //@ts-expect-error : ignore types
    within12Weeks(soknad?.datoInnsendt)
  );

  if (!paabegynteSoknader?.length && !fullforteSoknaderWithin12Weeks?.length) {
    return <></>;
  }

  return (
    <Section highlighted>
      <SectionContent>
        <Heading level="2" size="large" spacing>
          {getAppText("seksjon.mine-soknader.seksjonsbeskrivelse")}
        </Heading>
        {paabegynteSoknader === null && (
          <Alert variant="error" className={styles.errorContainer}>
            {getAppText("feil-melding.klarte-ikke-hente-paabegynt-soknader")}
          </Alert>
        )}
        {fullforteSoknader === null && (
          <Alert variant="error" className={styles.errorContainer}>
            {getAppText("feil-melding.klarte-ikke-hente-fullforte-soknader")}
          </Alert>
        )}
        {/* {!!paabegynteSoknader?.length && (
          <ul className={styles.soknader}>
            {paabegynteSoknader.map((soknad) => (
              <PaabegynteSoknader soknad={soknad as IPaabegynteSoknad} key={soknad.søknadId} />
            ))}
          </ul>
        )}
        {!!fullforteSoknaderWithin12Weeks.length && (
          <ul className={styles.soknader}>
            {fullforteSoknaderWithin12Weeks.map((soknad) => (
              <FullforteSoknader soknad={soknad as ISoknad} key={soknad.søknadId} />
            ))}
          </ul>
        )} */}
      </SectionContent>
    </Section>
  );
}
