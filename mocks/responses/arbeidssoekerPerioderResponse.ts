import type { IArbeidssokerperioder } from "~/models/getArbeidssoekerPerioder.server";

export const arbeidssoekerPerioderResponse: IArbeidssokerperioder[] = [
  {
    periodeId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    startet: {
      tidspunkt: "2021-09-29T11:22:33.444Z",
      utfoertAv: {
        type: "UKJENT_VERDI",
      },
      kilde: "string",
      aarsak: "string",
    },
    avsluttet: null,
    // avsluttet: {
    //   tidspunkt: "'2021-09-29T11:22:33.444Z'",
    //   utfoertAv: {
    //     type: "UKJENT_VERDI",
    //   },
    //   kilde: "string",
    //   aarsak: "string",
    // },
  },
];
