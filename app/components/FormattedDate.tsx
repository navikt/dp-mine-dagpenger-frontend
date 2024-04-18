interface IProps {
  date: string;
  shortDate?: boolean;
}

export function FormattedDate({ date, shortDate }: IProps) {
  const locale = "no-NO";

  const dateOption: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: shortDate ? "2-digit" : "long",
    day: shortDate ? "2-digit" : "numeric",
  };

  const formattedDate: string = new Date(date).toLocaleDateString(locale, dateOption);

  const timeOption: Intl.DateTimeFormatOptions = {
    timeStyle: "short",
  };

  const formattedTime: string = new Date(date).toLocaleTimeString(locale, timeOption);

  return (
    <>
      {formattedDate} - {formattedTime}
    </>
  );
}
