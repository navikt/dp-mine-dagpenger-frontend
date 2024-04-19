import { IKonto } from "~/models/getBankAccountNumber.server";

export function formatAccountNumber(bankAccount: IKonto) {
  if (!bankAccount?.kontonummer) {
    return;
  }

  const { kontonummer } = bankAccount;

  if (kontonummer.length > 11) {
    return kontonummer;
  } else {
    return `${kontonummer.slice(0, 4)} ${kontonummer.slice(4, 6)} ${kontonummer.slice(6, 12)}`;
  }
}
