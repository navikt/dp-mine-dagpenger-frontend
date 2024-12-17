import { getOKONOMIKontoregisterToken } from "~/utils/auth.utils.server";
import { getEnv } from "~/utils/env.utils";
import { INetworkResponse } from "./networkResponse";
import { logger } from "~/utils/logger.utils";

export type IKonto = {
  kontonummer: string;
  utenlandskKontoInfo?: UtenlandskKonto;
};

type UtenlandskKonto = {
  banknavn?: string;
  bankkode?: string;
  bankLandkode?: string;
  valutakode: string;
  swiftBicKode?: string;
  bankadresse1?: string;
  bankadresse2?: string;
  bankadresse3?: string;
};

export async function getBankAccountNumber(request: Request): Promise<INetworkResponse<IKonto>> {
  const url = `${getEnv("OKONOMI_KONTOREGISTER_URL")}/api/borger/v1/hent-aktiv-konto`;
  const onBehalfOfToken = await getOKONOMIKontoregisterToken(request);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${onBehalfOfToken}`,
    },
  });

  // Account holder not found
  if (!response.ok && response.status === 404) {
    logger.warn("Finner ikke kontonummer tilhører til bruker");

    return { status: "success", data: { kontonummer: "" } };
  }

  if (!response.ok) {
    logger.error("Feil ved uthenting av kontonummer");

    return {
      status: "error",
      error: {
        statusCode: response.status,
        statusText: "Feil ved uthenting av kontonummer",
      },
    };
  }

  const data: IKonto = await response.json();

  return { status: "success", data };
}
