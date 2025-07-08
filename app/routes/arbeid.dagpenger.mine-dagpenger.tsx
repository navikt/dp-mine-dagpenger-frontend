import { useEffect } from "react";
import { BankAccountNumber } from "~/components/bank-account-number/BankAccountNumber";
import { JournalpostList } from "~/components/journalposter/JournalpostList";
import { MeldFraOmEndring } from "~/components/meld-fra-om-endring/MeldFraOmEndring";
import { PageHero } from "~/components/page-hero/PageHero";
import { Shortcuts } from "~/components/shortcuts/Shortcuts";
import { SoknadList } from "~/components/soknad-list/SoknadList";
import { UxsignalsWidget } from "~/components/UxsignalsWidget";
import { getEnv } from "~/utils/env.utils";

export default function MineDagpenger() {
  useEffect(() => {
    // Task analytic Spørreundersøkelse for gammel og ny vedtaksbrev
    if (getEnv("IS_LOCALHOST") !== "true") {
      setTimeout(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (typeof window.TA === "function") {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          window.TA("start", "03411");
        }
      }, 1000);
    }
  });

  return (
    <main id="maincontent" tabIndex={-1}>
      <div className="mine-dagpenger">
        <PageHero />
        <UxsignalsWidget />
        <SoknadList />
        <BankAccountNumber />
        <MeldFraOmEndring />
        <Shortcuts />
        <JournalpostList />
      </div>
    </main>
  );
}
