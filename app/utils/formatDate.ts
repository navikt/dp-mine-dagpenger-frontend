export function formatDate(dato: string): string {
  const locale = "no-NO";

  const dateOption: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Europe/Oslo",
  };

  const formattedDate: string = new Date(dato).toLocaleDateString(locale, dateOption);
  const timeOption: Intl.DateTimeFormatOptions = {
    timeStyle: "short",
    timeZone: "Europe/Oslo",

  };

  const formattedTime: string = new Date(dato).toLocaleTimeString(locale, timeOption);
  return `${formattedDate} ${formattedTime}`;
}
