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
import { getPaabegynteSoknader } from "~/models/getPaabegynteSoknader.server";
import { getSession } from "~/models/getSession.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const fullforteSoknader = await getFullforteSoknader(request);
  const paabegynteSoknader = await getPaabegynteSoknader(request);
  const arbeidsseokerPerioder = await getArbeidssoekerPerioder(request);
  const bankAccountNumber = await getBankAccountNumber(request);
  const session = await getSession(request);

  throw new Error("Oh no! Something went wrong!");

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
