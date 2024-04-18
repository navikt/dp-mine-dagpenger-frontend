import { addWeeks, isBefore } from "date-fns";

export function within12Weeks(innsendt: string): boolean {
  const sendtDate: Date = new Date(innsendt);
  const today: Date = new Date();
  const endDate: Date = addWeeks(sendtDate, 12);
  return isBefore(today, endDate);
}
