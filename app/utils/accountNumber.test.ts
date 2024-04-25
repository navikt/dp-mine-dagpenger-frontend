import { expect, test } from "vitest";
import { formatAccountNumber } from "./accountNumber.utils";

test("Expect account number 12345678901 to be formatted as 1234 56 78901", () => {
  const formattedAccountNumber = formatAccountNumber("12345678901");
  expect(formattedAccountNumber).toBe("1234 56 78901");
});
