interface IProps {
  date: string;
  bareDato?: boolean;
  utenÅrstall?: boolean;
}

export function FormattedDate({ date, bareDato, utenÅrstall }: IProps) {
  const locale = "no-NO";

  const dateOption: Intl.DateTimeFormatOptions = {
    year: utenÅrstall ? undefined : "numeric",
    month: "long",
    day: "numeric",
  };

  const formattedDate: string = new Date(date).toLocaleDateString(locale, dateOption);

  if (bareDato) {
    return <>{formattedDate}</>;
  }

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
