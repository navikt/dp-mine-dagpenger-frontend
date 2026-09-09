import { useEffect } from "react";
import { BankAccountNumber } from "~/components/bank-account-number/BankAccountNumber";
import { JournalpostList } from "~/components/journalposter/JournalpostList";
import { MeldFraOmEndring } from "~/components/meld-fra-om-endring/MeldFraOmEndring";
import { PageHero } from "~/components/page-hero/PageHero";
import { Shortcuts } from "~/components/shortcuts/Shortcuts";
import { SøknadListe } from "~/components/søknad-liste/SøknadListe";
import { UxsignalsWidget } from "~/components/UxsignalsWidget";
import { useTypedRouteLoaderData } from "~/hooks/useTypedRouteLoaderData";
import { getEnv } from "~/utils/env.utils";

export default function MineDagpenger() {
  const { soknader } = useTypedRouteLoaderData("root");

  useEffect(() => {
    // Task analytic Spørreundersøkelse for gammel og ny vedtaksbrev
    if (getEnv("IS_LOCALHOST") !== "true") {
      setTimeout(() => {
        // @ts-expect-error -- window.TA blir satt av eksternt analyseskript
        if (typeof window.TA === "function") {
          // @ts-expect-error -- window.TA blir satt av eksternt analyseskript
          window.TA("start", "03411");
        }
      }, 1000);
    }
  }, []);

  const visSøknadListe = soknader.status === "success" && soknader.data?.length > 0;

  return (
    <main id="maincontent" tabIndex={-1}>
      <div className="mine-dagpenger">
        <PageHero />
        <UxsignalsWidget />
        {visSøknadListe && <SøknadListe />}
        <BankAccountNumber />
        <MeldFraOmEndring />
        <Shortcuts />
        <JournalpostList />
      </div>
    </main>
  );
}
