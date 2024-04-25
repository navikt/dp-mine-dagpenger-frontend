import { Alert } from "@navikt/ds-react";
import { PortableText } from "@portabletext/react";
import { useSanity } from "~/hooks/useSanity";
import { useTypedRouteLoaderData } from "~/hooks/useTypedRouteLoaderData";
import styles from "./ArbeidssokerStatus.module.css";

export function ArbeidssokerStatus() {
  const { getRichText } = useSanity();
  const { arbeidsseokerPerioder } = useTypedRouteLoaderData("routes/_index");

  if (arbeidsseokerPerioder.status === "error") {
    return (
      <Alert variant="warning" className="no-padding-portabletext">
        <PortableText value={getRichText("arbeidssokers-status.teknisk-feil")} />
      </Alert>
    );
  }

  const registered =
    arbeidsseokerPerioder.status === "success" &&
    arbeidsseokerPerioder.data?.perioder?.findIndex((periode) => periode.avsluttet === null) !== -1;

  if (arbeidsseokerPerioder.status === "success" && !registered) {
    return (
      <Alert variant="warning" className={styles.arbeidssokerStatusNotRegisteredAlertBox}>
        <PortableText value={getRichText("arbeidssokers-status.er-ikke-registrert")} />
      </Alert>
    );
  }

  return (
    <div className={styles.arbeidssokerStatusContainer}>
      <PortableText value={getRichText("arbeidssokers-status.er-registrert")} />
    </div>
  );
}
