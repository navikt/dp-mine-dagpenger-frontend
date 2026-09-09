import { Alert } from "@navikt/ds-react";
import { PortableText } from "@portabletext/react";
import classNames from "classnames";
import { useSanity } from "~/hooks/useSanity";
import { useTypedRouteLoaderData } from "~/hooks/useTypedRouteLoaderData";
import styles from "./ArbeidssokerStatus.module.css";

export function ArbeidssokerStatus() {
  const { getRichText } = useSanity();
  const { arbeidssøkerStatus } = useTypedRouteLoaderData("root");

  if (arbeidssøkerStatus === "FEIL") {
    return (
      <Alert variant="warning" className="no-padding-portabletext">
        <PortableText value={getRichText("arbeidssokers-status.teknisk-feil")} />
      </Alert>
    );
  }

  if (arbeidssøkerStatus === "IKKE_REGISTRERT") {
    return (
      <Alert variant="warning" className="no-padding-portabletext">
        <PortableText value={getRichText("arbeidssokers-status.er-ikke-registrert")} />
      </Alert>
    );
  }

  return (
    <div className={classNames("no-padding-portabletext", styles.arbeidssokerStatusContainer)}>
      <PortableText value={getRichText("arbeidssokers-status.er-registrert")} />
    </div>
  );
}
