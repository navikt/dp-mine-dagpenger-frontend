import { LoaderFunctionArgs, json } from "@remix-run/node";
import { BankAccountNumber } from "~/components/bank-account-number/BankAccountNumber";
import { MeldFraOmEndring } from "~/components/meld-fra-om-endring/MeldFraOmEndring";
import { PageHero } from "~/components/page-hero/PageHero";
import { Shortcuts } from "~/components/shortcuts/Shortcuts";
import { Soknader } from "~/components/soknader/Soknader";
import { getArbeidssoekerPerioder } from "~/models/getArbeidssoekerPerioder.server";
import { getBankAccount } from "~/models/getBankAccountNumber.server";
import { getSoknader } from "~/models/getSoknader.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const fullforteSoknader = await getSoknader(request, "soknad");
  const paabegynteSoknader = await getSoknader(request, "paabegynte");
  // const arbeidsseokerPerioder = await getArbeidssoekerPerioder(request);
  // const bankAccount = await getBankAccount(request);

  return json({
    fullforteSoknader,
    paabegynteSoknader,
    // arbeidsseokerPerioder,
    // bankAccount,
  });
}

export default function Index() {
  return (
    <main>
      <div className="mine-dagpenger">
        <PageHero />
        <Soknader />
        {/* <BankAccountNumber /> */}
        <MeldFraOmEndring />
        <Shortcuts />
      </div>
    </main>
  );
}
