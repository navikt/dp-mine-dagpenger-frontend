import {
  DecoratorElements,
  fetchDecoratorHtml,
  type DecoratorFetchProps,
} from "@navikt/nav-dekoratoren-moduler/ssr";

export async function getDekoratorHTML(): Promise<DecoratorElements> {
  const env = "dev";

  const config: DecoratorFetchProps = {
    env: env ?? "prod",
    serviceDiscovery: false, //process.env.IS_LOCALHOST !== "true", //virker som at den defaulter til true og slår på service discovery?
    params: {
      language: "nb",
      context: "privatperson",
      chatbot: false,
      simple: true,
      enforceLogin: false,
      redirectToApp: true,
      level: "Level4",
    },
  };

  return await fetchDecoratorHtml(config);
}
