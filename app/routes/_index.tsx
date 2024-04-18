import { LoaderFunctionArgs, json } from "@remix-run/node";
import { ArbeidssokerStatus } from "~/components/arbeidssoker-status/ArbeidssokerStatus";
import { PageHero } from "~/components/page-hero/PageHero";
import { Soknader } from "~/components/soknader/Soknader";
import { useTypedRouteLoaderData } from "~/hooks/useTypedRouteLoaderData";
import { getArbeidssoekerPerioder } from "~/models/getArbeidssoekerPerioder";
import { getSoknader } from "~/models/getSoknader.models";

export async function loader({ request }: LoaderFunctionArgs) {
  const fullforteSoknader = await getSoknader(request, "soknad");
  const paabegynteSoknader = await getSoknader(request, "paabegynte");
  const arbeidsseokerPerioder = await getArbeidssoekerPerioder(request);

  return json({ fullforteSoknader, paabegynteSoknader, arbeidsseokerPerioder });
}

export default function Index() {
  return (
    <div className="mine-dagpenger">
      <PageHero />
      <Soknader />
    </div>
  );
}
