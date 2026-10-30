import { BellDotIcon } from "@navikt/aksel-icons";
import { LinkCard } from "@navikt/ds-react";
import { useSanity } from "~/hooks/useSanity";
import { useTypedRouteLoaderData } from "~/hooks/useTypedRouteLoaderData";
import { formaterDato } from "~/utils/dato.utils";
import { hentMeldekortForVisning } from "./meldekort.utils";
import styles from "./SendMeldekortKort.module.css";

export function SendMeldekortKort() {
  const { getAppText, getLink } = useSanity();
  const { meldekort, dagensDatoNorge } = useTypedRouteLoaderData("root");

  if (meldekort.status === "error") {
    return null;
  }

  const { klartMeldekort, sendMeldekortUrl } = hentMeldekortForVisning(
    meldekort.data,
    dagensDatoNorge
  );

  if (!klartMeldekort || !sendMeldekortUrl) {
    return null;
  }

  return (
    <LinkCard data-color="warning" className={styles.kort}>
      <LinkCard.Icon className={styles.neutralTekst}>
        <BellDotIcon aria-hidden fontSize="2rem" />
      </LinkCard.Icon>
      <LinkCard.Title className={styles.neutralTekst}>
        <LinkCard.Anchor href={sendMeldekortUrl}>
          {getLink("meldekort.send").linkText}
        </LinkCard.Anchor>
      </LinkCard.Title>
      <LinkCard.Description>
        {getAppText("meldekort.frist-for-innsending")}{" "}
        {formaterDato(klartMeldekort.fristForInnsending)}
      </LinkCard.Description>
    </LinkCard>
  );
}
