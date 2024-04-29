import { BankAccountNumber } from "~/components/bank-account-number/BankAccountNumber";
import { MeldFraOmEndring } from "~/components/meld-fra-om-endring/MeldFraOmEndring";
import { PageHero } from "~/components/page-hero/PageHero";
// import { SessionModal } from "~/components/session-modal/SessionModal";
import { Shortcuts } from "~/components/shortcuts/Shortcuts";
import { Soknader } from "~/components/soknader/Soknader";

export default function Index() {
  return (
    <main>
      <div className="mine-dagpenger">
        <PageHero />
        <Soknader />
        <BankAccountNumber />
        <MeldFraOmEndring />
        <Shortcuts />
        {/* <SessionModal /> */}
      </div>
    </main>
  );
}
