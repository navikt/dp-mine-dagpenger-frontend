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
): Promise<INetworkResponse<{ accountNumber: string }>> {
  const url = `${getEnv("OKONOMI_KONTOREGISTER_URL")}/api/borger/v1`;

  const onBehalfOfToken = await getOKONOMIKontoregisterToken(request);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${onBehalfOfToken}`,
    },
  });

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
