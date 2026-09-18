import { Heading } from "@navikt/ds-react";
import { useSanity } from "~/hooks/useSanity";
import { AktivDagpengerettAlert } from "../aktiv-dagpengerett/AktivDagpengerettAlert";
import { ArbeidssokerStatus } from "../arbeidssoker-status/ArbeidssokerStatus";
import { Section } from "../section/Section";
import { SectionContent } from "../section/SectionContent";
import { useRouteLoaderData } from "react-router";
import { harAktivDagpengerRett as hentBrukerHarAktivDagpengerRett } from "../aktiv-dagpengerett/aktivDagpengerett.utils";
import type { INetworkResponse } from "~/models/networkResponse";
import { ISoknad, ISøknadData } from "~/models/hentSøknader.server";

export function PageHero() {
  const { getAppText } = useSanity();
  const { aktivDagpengerett, søknader} = useRouteLoaderData("root");
  const harAktivDagpengerRett = hentBrukerHarAktivDagpengerRett(aktivDagpengerett);
  const vedtakForNyesteSøknad = hentSisteSøknad(søknader as INetworkResponse<ISøknadData>)?.søknadVedtak;
  const visAktivDagpengerettAlert = harAktivDagpengerRett && vedtakForNyesteSøknad === "Innvilgelse";

  return (
    <Section>
      <SectionContent>
        <Heading className="page-header" size="xlarge">
          {getAppText("sidetittel")}
        </Heading>
        {visAktivDagpengerettAlert && <AktivDagpengerettAlert />}
        <ArbeidssokerStatus />
      </SectionContent>
    </Section>
  );
}

export function hentSisteSøknad(søknader: INetworkResponse<ISøknadData>): ISoknad | null {
  if (søknader.status !== "success") {
    return null;
  }
  const { fullførteSøknader } = søknader.data;
  return fullførteSøknader.length > 0 ? fullførteSøknader[0] : null;
}
