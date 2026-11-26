import { BodyLong, Heading, InlineMessage, Link } from "@navikt/ds-react";
import { useRouteLoaderData } from "react-router";
import { useSanity } from "~/hooks/useSanity";
import { formatAccountNumber } from "~/utils/accountNumber.utils";
import styles from "./UtbetalingOgKontonummer.module.css";
import { PortableTextRenderer } from "../portable-text/PortableTextRenderer";

export function UtbetalingOgKontonummer() {
  const { getAppText, getRichText, getLink } = useSanity();
  const { bankAccountNumber } = useRouteLoaderData("root");

  const accountNumber =
    bankAccountNumber.status === "success" && bankAccountNumber.data.kontonummer;
  const updateAccountNumberLink = getLink("kontonummer.endre-kontonummeret");

  return (
    <section className="pageSection">
      <Heading level="2" size="large">
        {getAppText("seksjon.utbetaling.seksjonstittel")}
      </Heading>
      <BodyLong>{getAppText("seksjon.utbetaling.seksjonsbeskrivelse")}</BodyLong>
      <div className={styles.container}>
        {bankAccountNumber.status === "error" ? (
          <InlineMessage status="error">
            <PortableTextRenderer value={getRichText("kontonummer.teknisk-feil")} />
          </InlineMessage>
        ) : accountNumber ? (
          <dl className={styles.dataList}>
            <dt>{getAppText("kontonummer.registrert-kontonummeret")}</dt>
            <dd className={styles.accountNumber}>
              {formatAccountNumber(accountNumber)}
              <Link href={updateAccountNumberLink.linkUrl}>{updateAccountNumberLink.linkText}</Link>
            </dd>
          </dl>
        ) : (
          <PortableTextRenderer value={getRichText("kontonummer.mangler-kontonummer")} />
        )}
      </div>
    </section>
  );
}
