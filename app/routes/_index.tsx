import { LoaderFunctionArgs } from "@remix-run/node";
import { typedjson } from "remix-typedjson";
import { BankAccountNumber } from "~/components/bank-account-number/BankAccountNumber";
import { JournalpostList } from "~/components/journalposter/JournalpostList";
import { MeldFraOmEndring } from "~/components/meld-fra-om-endring/MeldFraOmEndring";
import { PageHero } from "~/components/page-hero/PageHero";
import { Shortcuts } from "~/components/shortcuts/Shortcuts";
import { SoknadList } from "~/components/soknad-list/SoknadList";
import { getArbeidssoekerPerioder } from "~/models/getArbeidssoekerPerioder.server";
import { getBankAccountNumber } from "~/models/getBankAccountNumber.server";
import { getFullforteSoknader } from "~/models/getFullfortSoknader.server";
import { getPaabegynteSoknader } from "~/models/getPaabegynteSoknader.server";
import { getJournalposter } from "~/models/safselvbetjening.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const fullforteSoknader = await getFullforteSoknader(request);
  const paabegynteSoknader = await getPaabegynteSoknader(request);
  const arbeidsseokerPerioder = await getArbeidssoekerPerioder(request);
  const bankAccountNumber = await getBankAccountNumber(request);
  const journalposter = await getJournalposter(request);

  return typedjson({
    fullforteSoknader,
    paabegynteSoknader,
    arbeidsseokerPerioder,
    bankAccountNumber,
    journalposter,
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
        <JournalpostList />
      </div>
    </main>
  );
}
