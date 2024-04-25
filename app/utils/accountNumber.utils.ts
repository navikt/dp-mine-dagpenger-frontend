export function formatAccountNumber(accountNumber: string): string {
  return accountNumber.length > 11
    ? accountNumber
    : `${accountNumber.slice(0, 4)} ${accountNumber.slice(4, 6)} ${accountNumber.slice(6, 12)}`;
}
