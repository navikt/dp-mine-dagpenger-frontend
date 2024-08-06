import { LoaderFunctionArgs, json } from "@remix-run/node";
import { BankAccountNumber } from "~/components/bank-account-number/BankAccountNumber";
import { MeldFraOmEndring } from "~/components/meld-fra-om-endring/MeldFraOmEndring";
import { PageHero } from "~/components/page-hero/PageHero";
import { SessionModal } from "~/components/session-modal/SessionModal";
import { Shortcuts } from "~/components/shortcuts/Shortcuts";
import { SoknadList } from "~/components/soknad-list/SoknadList";
import { getArbeidssoekerPerioder } from "~/models/getArbeidssoekerPerioder.server";
import { getBankAccountNumber } from "~/models/getBankAccountNumber.server";
import { getFullforteSoknader } from "~/models/getFullfortSoknader.server";
import { getJournalposter } from "~/models/getJournalposter.server";
import { getPaabegynteSoknader } from "~/models/getPaabegynteSoknader.server";
import { getSession } from "~/models/getSession.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const journalposter = await getJournalposter(request);

  console.log(`🔥 journalposter :`, journalposter);

  const [fullforteSoknader, paabegynteSoknader, arbeidsseokerPerioder, bankAccountNumber, session] =
    await Promise.all([
      getFullforteSoknader(request),
      getPaabegynteSoknader(request),
      getArbeidssoekerPerioder(request),
      getBankAccountNumber(request),
      getSession(request),
    ]);

  return json({
    fullforteSoknader,
    paabegynteSoknader,
    arbeidsseokerPerioder,
    bankAccountNumber,
    session,
  });
}

export default function Index() {
  return (
    <main>
      <div className="mine-dagpenger">
        <PageHero />
        <SoknadList />
        <BankAccountNumber />
        <MeldFraOmEndring />
        <Shortcuts />
        <SessionModal />
      </div>
    </main>
  );
}
