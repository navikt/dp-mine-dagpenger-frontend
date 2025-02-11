import { Alert } from "@navikt/ds-react";
import { PortableText } from "@portabletext/react";
import classNames from "classnames";
import { useSanity } from "~/hooks/useSanity";
import styles from "./ArbeidssokerStatus.module.css";
import { IArbeidssokerperioder } from "~/models/getArbeidssoekerPerioder.server";
import { useRouteLoaderData } from "react-router";
import { loader } from "~/routes/index";

export function ArbeidssokerStatus() {
  const { getRichText } = useSanity();
  const data = useRouteLoaderData<typeof loader>("routes/index");

  if (data?.arbeidsseokerPerioder.status === "error") {
    return (
      <Alert variant="warning" className="no-padding-portabletext">
        <PortableText value={getRichText("arbeidssokers-status.teknisk-feil")} />
      </Alert>
    );
  }

  const registered =
    data?.arbeidsseokerPerioder.status === "success" &&
    data?.arbeidsseokerPerioder.data?.findIndex(
      (periode: IArbeidssokerperioder) => periode.avsluttet === null
    ) !== -1;

  if (data?.arbeidsseokerPerioder.status === "success" && !registered) {
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
