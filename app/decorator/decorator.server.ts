import {
  DecoratorElements,
  fetchDecoratorHtml,
  type DecoratorFetchProps,
} from "@navikt/nav-dekoratoren-moduler/ssr";

export async function getDecoratorHTML(): Promise<DecoratorElements> {
  const env = "dev";

  const config: DecoratorFetchProps = {
    env: env ?? "prod",
    params: {
      language: "nb",
      context: "privatperson",
      chatbot: false,
      enforceLogin: false,
      redirectToApp: true,
      level: "Level4",
      breadcrumbs: [
        { title: "Min side", url: "https://www.nav.no/minside" },
        {
          title: "Mine dagpenger",
          url: "https://www.nav.no/arbeid/dagpenger/mine-dagpenger",
        },
      ],
    },
  };

  return await fetchDecoratorHtml(config);
}
