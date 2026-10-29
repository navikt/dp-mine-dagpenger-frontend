import { TZDate, tz } from "@date-fns/tz";
import { format, parseISO } from "date-fns";
import { nb } from "date-fns/locale";

const TIDSSONE = "Europe/Oslo";

export function formaterDato(dato: Date | string, dateFormat = "d. MMMM yyyy") {
  const datoIOslo =
    typeof dato === "string"
      ? parseISO(dato, { in: tz(TIDSSONE) })
      : new TZDate(dato.getTime(), TIDSSONE);

  return format(datoIOslo, dateFormat, { locale: nb });
}

export function norskKalenderdato(dato: Date) {
  return formaterDato(dato, "yyyy-MM-dd");
}
