import { Alert, BodyLong, Heading, Link } from "@navikt/ds-react";
import { PortableText } from "@portabletext/react";
import { useSanity } from "~/hooks/useSanity";
import { useTypedRouteLoaderData } from "~/hooks/useTypedRouteLoaderData";
import { Section } from "../section/Section";
import { SectionContent } from "../section/SectionContent";
import { formatAccountNumber } from "~/utils/accountNumber.utils";
import styles from "./BankAccountNumber.module.css";

export function BankAccountNumber() {
  const { getAppText, getRichText, getLink } = useSanity();
  const { bankAccountNumber } = useTypedRouteLoaderData("root");

  if (bankAccountNumber.status === "error") {
    return (
      <Section>
        <SectionContent>
          <Alert variant="warning" className="no-padding-portabletext">
            <PortableText value={getRichText("kontonummer.teknisk-feil")} />
          </Alert>
        </SectionContent>
      </Section>
    );
  }

  const accountNumber =
    bankAccountNumber.status === "success" && bankAccountNumber.data.kontonummer;
  const updateAccountNumberLink = getLink("kontonummer.endre-kontonummeret");

  return (
    <Section>
      <SectionContent>
        <Heading level="2" size="large" spacing>
          {getAppText("seksjon.utbetaling.seksjonstittel")}
        </Heading>
        <BodyLong spacing>{getAppText("seksjon.utbetaling.seksjonsbeskrivelse")}</BodyLong>
        {accountNumber && (
          <div className={styles.container}>
            <Heading level="3" size="xsmall">
              {getAppText("kontonummer.registrert-kontonummeret")}
            </Heading>
            <div className={styles.accountNumber}>
              {formatAccountNumber(accountNumber)}
              <Link href={updateAccountNumberLink.linkUrl}>{updateAccountNumberLink.linkText}</Link>
            </div>
          </div>
        )}
        {!accountNumber && <PortableText value={getRichText("kontonummer.mangler-kontonummer")} />}
      </SectionContent>
    </Section>
  );
}
