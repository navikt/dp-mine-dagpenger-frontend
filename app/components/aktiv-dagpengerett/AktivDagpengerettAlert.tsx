import { CheckmarkCircleIcon, LightBulbIcon } from "@navikt/aksel-icons";
import { BodyLong, InfoCard, Link, List } from "@navikt/ds-react";
import { useRouteLoaderData } from "react-router";
import { skalViseAktivDagpengerettAlert } from "./aktivDagpengerett.utils";
import styles from "./AktivDagpengerettAlert.module.css";

export function AktivDagpengerettAlert() {
  const { aktivDagpengerett } = useRouteLoaderData("root");

  if (!skalViseAktivDagpengerettAlert(aktivDagpengerett)) {
    return null;
  }

  return (
    <InfoCard data-color="success" className={styles.infoCard}>
      <InfoCard.Header icon={<CheckmarkCircleIcon aria-hidden />}>
        <InfoCard.Title>Du har rett til dagpenger</InfoCard.Title>
      </InfoCard.Header>
      <InfoCard.Content>
        <div className={styles.ingress}>
          <LightBulbIcon aria-hidden fontSize="1.5rem" />
          <BodyLong>Når du har rett til dagpenger er det flere ting du må huske på.</BodyLong>
        </div>
        <List>
          <List.Item>Du må sende meldekort hver 14. dag</List.Item>
          <List.Item>Du må være registrert som arbeidssøker</List.Item>
          <List.Item>Du må være tilgjengelig for Nav</List.Item>
          <List.Item>Du må gi beskjed om endringer</List.Item>
        </List>
        <Link href="https://www.nav.no/dagpenger#har" className={styles.lenke}>
          Mer informasjon om hva du må gjøre når du har dagpenger
        </Link>
      </InfoCard.Content>
    </InfoCard>
  );
}
