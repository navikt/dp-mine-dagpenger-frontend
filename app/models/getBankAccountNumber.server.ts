import { getOKONOMIKontoregisterToken } from "~/utils/auth.utils.server";
import { getEnv } from "~/utils/env.utils";

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

export async function getBankAccount(request: Request): Promise<IKonto> {
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

  return response.json();
}
