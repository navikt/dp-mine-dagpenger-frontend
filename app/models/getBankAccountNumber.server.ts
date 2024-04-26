import { getOKONOMIKontoregisterToken } from "~/utils/auth.utils.server";
import { getEnv } from "~/utils/env.utils";
import { INetworkResponse } from "~/utils/networkResponse";

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

export async function getBankAccountNumber(
  request: Request
): Promise<INetworkResponse<{ accountNumber: string | undefined }>> {
  const url = `${getEnv("OKONOMI_KONTOREGISTER_URL")}/api/borger/v1/hent-aktiv-konto`;
  const onBehalfOfToken = await getOKONOMIKontoregisterToken(request);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${onBehalfOfToken}`,
    },
  });

  // user not found in Kontoregister
  if (!response.ok && response.status === 404) {
    return { status: "success", data: { accountNumber: undefined } };
  }

  if (!response.ok) {
    return {
      status: "error",
      error: {
        statusCode: response.status,
        statusText: "Feil ved uthenting av kontonummer",
      },
    };
  }

  const bankAccountResponse: IKonto = await response.json();

  return { status: "success", data: { accountNumber: bankAccountResponse.kontonummer } };
}
