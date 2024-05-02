import { describe, expect, test } from "vitest";
import { formatAccountNumber } from "./accountNumber.utils";

describe("Format bank account number", () => {
  test("Expect account number 12345678901 to be formatted as 1234 56 78901", () => {
    const formattedAccountNumber = formatAccountNumber("12345678901");
    expect(formattedAccountNumber).toBe("1234 56 78901");
  });

  test("Expect account number 10987654321 to be formatted as 1098 76 54321", () => {
    const formattedAccountNumber = formatAccountNumber("10987654321");
    expect(formattedAccountNumber).toBe("1098 76 54321");
  });
});
