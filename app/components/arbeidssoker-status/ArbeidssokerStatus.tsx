import { LocalAlert } from "@navikt/ds-react";
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
      <LocalAlert status="warning" className="no-padding-portabletext">
        <PortableText value={getRichText("arbeidssokers-status.teknisk-feil")} />
      </LocalAlert>
    );
  }

  if (arbeidssøkerStatus === "IKKE_REGISTRERT") {
    return (
      <LocalAlert status="warning" className="no-padding-portabletext">
        <PortableText value={getRichText("arbeidssokers-status.er-ikke-registrert")} />
      </LocalAlert>
    );
  }

  return (
    <div className={classNames("no-padding-portabletext", styles.arbeidssokerStatusContainer)}>
      <PortableText value={getRichText("arbeidssokers-status.er-registrert")} />
    </div>
  );
}
