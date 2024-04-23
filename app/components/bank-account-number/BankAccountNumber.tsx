import { BodyLong, Heading, Link } from "@navikt/ds-react";
import { PortableText } from "@portabletext/react";
import { useSanity } from "~/hooks/useSanity";
import { useTypedRouteLoaderData } from "~/hooks/useTypedRouteLoaderData";
import { Section } from "../section/Section";
import { SectionContent } from "../section/SectionContent";
import { formatAccountNumber } from "~/utils/accountNumber.utils";
import styles from "./BankAccountNumber.module.css";

export function BankAccountNumber() {
  const { getAppText, getRichText, getLink } = useSanity();
  const { bankAccount } = useTypedRouteLoaderData("routes/_index");

  const hasAccountNumber = bankAccount && bankAccount.kontonummer;
  const updateAccountNumberLink = getLink("kontonummer.endre-kontonummeret");

  return (
    <Section>
      <SectionContent>
        <Heading level="2" size="large" spacing>
          {getAppText("seksjon.utbetaling.seksjonstittel")}
        </Heading>
        <BodyLong spacing>{getAppText("seksjon.utbetaling.seksjonsbeskrivelse")}</BodyLong>
        {hasAccountNumber && (
          <div className={styles.container}>
            <Heading level="3" size="xsmall">
              {getAppText("kontonummer.registrert-kontonummeret")}
            </Heading>
            <div className={styles.accountNumber}>
              {formatAccountNumber(bankAccount)}
              <Link href={updateAccountNumberLink.linkUrl}>{updateAccountNumberLink.linkText}</Link>
            </div>
          </div>
        )}
        {!hasAccountNumber && (
          <PortableText value={getRichText("kontonummer.mangler-kontonummer")} />
        )}
      </SectionContent>
    </Section>
  );
}