import { Alert } from "@navikt/ds-react";
import { PortableText } from "@portabletext/react";
import classNames from "classnames";
import { useRouteLoaderData } from "react-router";
import { useSanity } from "~/hooks/useSanity";
import type { IArbeidssokerperioder } from "~/models/getArbeidssoekerPerioder.server";
import styles from "./ArbeidssokerStatus.module.css";

export function ArbeidssokerStatus() {
  const { getRichText } = useSanity();
  const { arbeidsseokerPerioder } = useRouteLoaderData("root");

  if (arbeidsseokerPerioder.status === "error") {
    return (
      <Alert variant="warning" className="no-padding-portabletext">
        <PortableText value={getRichText("arbeidssokers-status.teknisk-feil")} />
      </Alert>
    );
  }

  const registered =
    arbeidsseokerPerioder.status === "success" &&
    arbeidsseokerPerioder.data?.findIndex(
      (periode: IArbeidssokerperioder) => periode.avsluttet === null
    ) !== -1;

  if (arbeidsseokerPerioder.status === "success" && !registered) {
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
