import { LoaderFunctionArgs } from "@remix-run/node";
import { useEffect } from "react";
import { typedjson } from "remix-typedjson";
import { BankAccountNumber } from "~/components/bank-account-number/BankAccountNumber";
import { JournalpostList } from "~/components/journalposter/JournalpostList";
import { MeldFraOmEndring } from "~/components/meld-fra-om-endring/MeldFraOmEndring";
import { PageHero } from "~/components/page-hero/PageHero";
import { Shortcuts } from "~/components/shortcuts/Shortcuts";
import { SoknadList } from "~/components/soknad-list/SoknadList";
import { UxsignalsWidget } from "~/components/UxsignalsWidget";
import { getArbeidssoekerPerioder } from "~/models/getArbeidssoekerPerioder.server";
import { getBankAccountNumber } from "~/models/getBankAccountNumber.server";
import { getFullforteSoknader } from "~/models/getFullfortSoknader.server";
import { getPaabegynteSoknader } from "~/models/getPaabegynteSoknader.server";
import { getSAFJournalposter } from "~/models/getSAFJournalposter.server";
import { getEnv } from "~/utils/env.utils";

export async function loader({ request }: LoaderFunctionArgs) {
  const fullforteSoknader = await getFullforteSoknader(request);
  const paabegynteSoknader = await getPaabegynteSoknader(request);
  const arbeidsseokerPerioder = await getArbeidssoekerPerioder(request);
  const bankAccountNumber = await getBankAccountNumber(request);
  const journalposter = await getSAFJournalposter(request);

  return typedjson({
    fullforteSoknader,
    paabegynteSoknader,
    arbeidsseokerPerioder,
    bankAccountNumber,
    journalposter,
  });
}

export default function Index() {
  useEffect(() => {
    const key = getEnv("APP_ENV") === "production" ? "03409" : "03400";

    setTimeout(() => {
      //@ts-expect-error: Ukjent TA type
      if (typeof window.TA === "function") {
        //@ts-expect-error: Ukjent TA type
        window.TA("start", key);
      }
    }, 1500);
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
