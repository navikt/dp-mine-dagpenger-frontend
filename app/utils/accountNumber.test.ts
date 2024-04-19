import { expect, test } from "vitest";
import { formatAccountNumber } from "./accountNumber.utils";
import { IKonto } from "~/models/getBankAccountNumber.server";

test("Expect account number 12345678901 to be formatted as 1234 56 78901", () => {
  const bankAccount: IKonto = {
    kontonummer: "12345678901",
  };

  const formattedAccountNumber = formatAccountNumber(bankAccount);

  expect(formattedAccountNumber).toBe("1234 56 78901");
});
