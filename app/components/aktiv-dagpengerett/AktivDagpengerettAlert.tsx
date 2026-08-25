import { CheckmarkCircleIcon } from "@navikt/aksel-icons";
import { BodyLong, InfoCard } from "@navikt/ds-react";
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
        <InfoCard.Title>Du mottar dagpenger</InfoCard.Title>
      </InfoCard.Header>
      <InfoCard.Content>
        <BodyLong>Når du mottar dagpenger må du sende meldekort innen fristen.</BodyLong>
      </InfoCard.Content>
    </InfoCard>
  );
}
