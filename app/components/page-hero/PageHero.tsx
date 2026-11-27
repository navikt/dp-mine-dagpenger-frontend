import { Heading } from "@navikt/ds-react";
import { useSanity } from "~/hooks/useSanity";
import { AktivDagpengerettAlert } from "../aktiv-dagpengerett/AktivDagpengerettAlert";
import { useRouteLoaderData } from "react-router";
import { harAktivDagpengerRett as hentBrukerHarAktivDagpengerRett } from "../aktiv-dagpengerett/aktivDagpengerett.utils";
import { SendMeldekortKort } from "~/components/SendMeldekortKort/SendMeldekortKort";

export function PageHero() {
  const { getAppText } = useSanity();
  const { aktivDagpengerett } = useRouteLoaderData("root");
  const harAktivDagpengerRett = hentBrukerHarAktivDagpengerRett(aktivDagpengerett);

  return (
    <section className="pageSection">
      <Heading size="xlarge">{getAppText("sidetittel")}</Heading>
      <SendMeldekortKort />
      {harAktivDagpengerRett && <AktivDagpengerettAlert />}
    </section>
  );
}
