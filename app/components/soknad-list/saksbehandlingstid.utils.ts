import type { INetworkResponse } from "~/models/networkResponse";
import type { Søknad } from "~/models/getSoknader.server";
import { isAfter, subWeeks } from "date-fns";
import { hentSøknaderSiste12Uker } from "~/utils/soknad.utils";

const estimertSaksbehandlingstid = 7;

interface FullførteSøknaderTilVisning {
  estimertSaksbehandlingstid: number;
  nyesteSøknad: Søknad | null;
  søknaderTilVisning: Søknad[];
  visSaksbehandlingstid: boolean;
}

export function finnFullførteSøknaderTilVisning(
  søknader: Søknad[],
  aktivDagpengerett: INetworkResponse<boolean>
): FullførteSøknaderTilVisning | null {
  const fullførteSøknader = hentSøknaderSiste12Uker(
    søknader.filter(
      (søknad) =>
        søknad.søknadId && (søknad.status === "INNSENDT" || søknad.status === "JOURNALFØRT")
    )
  )
    .sort(
      (søknadA, søknadB) =>
        new Date(søknadB.innsendtTimestamp).getTime() -
        new Date(søknadA.innsendtTimestamp).getTime()
    );

  if (fullførteSøknader.length === 0) {
    return null;
  }

  const visSaksbehandlingstid = skalViseSaksbehandlingstid(aktivDagpengerett);
  const nyesteSøknad = erNyesteSøknadInnenforSaksbehandlingstid(fullførteSøknader)
    ? fullførteSøknader[0]
    : null;

  return {
    estimertSaksbehandlingstid,
    nyesteSøknad,
    søknaderTilVisning: filtrerSoknaderTilVisning(
      fullførteSøknader,
      nyesteSøknad,
      visSaksbehandlingstid
    ),
    visSaksbehandlingstid,
  };
}

function erNyesteSøknadInnenforSaksbehandlingstid(søknader: Søknad[]): boolean {
  return isAfter(
    new Date(søknader[0].innsendtTimestamp),
    subWeeks(new Date(), estimertSaksbehandlingstid + 2)
  );
}

export function skalViseSaksbehandlingstid(
  aktivDagpengerett: INetworkResponse<boolean>
): boolean {
  return aktivDagpengerett.status !== "success" || !aktivDagpengerett.data;
}

export function filtrerSoknaderTilVisning(
  soknader: Søknad[],
  nyesteSøknad: Søknad | null,
  visSaksbehandlingstid: boolean
): Søknad[] {
  if (!nyesteSøknad || !visSaksbehandlingstid) {
    return soknader;
  }

  return soknader.filter((soknad) => soknad.søknadId !== nyesteSøknad.søknadId);
}
