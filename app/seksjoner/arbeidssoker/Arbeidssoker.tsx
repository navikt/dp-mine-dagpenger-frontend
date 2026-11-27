import { BodyLong, Heading, InlineMessage, Tag } from "@navikt/ds-react";
import { PortableTextRenderer } from "~/components/portable-text/PortableTextRenderer";
import { useSanity } from "~/hooks/useSanity";
import { useTypedRouteLoaderData } from "~/hooks/useTypedRouteLoaderData";
import styles from "./Arbeidssoker.module.css";

export function Arbeidssoker() {
  const { getAppText, getRichText } = useSanity();
  const { arbeidssøkerStatus, aktivDagpengerett } = useTypedRouteLoaderData("root");
  const beskrivelse =
    aktivDagpengerett.status === "success" && aktivDagpengerett.data === false
      ? "arbeidssoker.beskrivelse.uten-dagpengerett"
      : "arbeidssoker.beskrivelse.med-dagpengerett";

  return (
    <section className="pageSection">
      <Heading level="2" size="large">
        {getAppText("arbeidssoker.tittel")}
      </Heading>
      <PortableTextRenderer value={getRichText(beskrivelse)} />
      <dl className={styles.status}>
        <BodyLong as="dt" weight="semibold">
          {getAppText("arbeidssoker.din-status")}
        </BodyLong>
        <dd className={styles.statusverdi}>
          {arbeidssøkerStatus === "FEIL" ? (
            <InlineMessage status="error">
              <PortableTextRenderer value={getRichText("arbeidssokers-status.teknisk-feil")} />
            </InlineMessage>
          ) : (
            <Tag variant={arbeidssøkerStatus === "REGISTRERT" ? "success" : "warning"}>
              {arbeidssøkerStatus === "REGISTRERT"
                ? getAppText("arbeidssoker.status.registrert")
                : getAppText("arbeidssoker.status.ikke-registrert")}
            </Tag>
          )}
        </dd>
      </dl>
    </section>
  );
}
