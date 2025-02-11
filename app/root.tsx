import navStyles from "@navikt/ds-css/dist/index.css?url";
import { BodyShort } from "@navikt/ds-react";
import { createClient } from "@sanity/client";
import parse from "html-react-parser";
import {
  Links,
  LinksFunction,
  Meta,
  MetaFunction,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
  useRouteLoaderData,
} from "react-router";
import { Route } from "./+types/root";
import { Section } from "./components/section/Section";
import { SectionContent } from "./components/section/SectionContent";
import { useInjectDecoratorScript } from "./hooks/useInjectDecoratorScript";
import indexStyle from "./index.css?url";
import { getDecoratorHTML } from "./models/decorator.server";
import { getSession } from "./models/getSession.server";
import { sanityConfig } from "./sanity/sanity.config";
import { allTextsQuery } from "./sanity/sanity.query";
import { ISanityData } from "./sanity/sanity.types";
import { unleash } from "./unleash";
import { getEnv } from "./utils/env.utils";
import { logger } from "./utils/logger.utils";

export const sanityClient = createClient(sanityConfig);

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: navStyles },
  { rel: "stylesheet", href: indexStyle },
  {
    rel: "icon",
    type: "image/png",
    sizes: "32x32",
    href: "favicon-32x32.png",
  },
  {
    rel: "icon",
    type: "image/png",
    sizes: "16x16",
    href: "favicon-16x16.png",
  },
  {
    rel: "icon",
    type: "image/x-icon",
    href: "favicon.ico",
  },
];

export const meta: MetaFunction = () => {
  return [
    { title: "Mine dagpenger" },
    {
      property: "og:title",
      content: "Mine dagpenger",
    },
    {
      name: "description",
      content: "Mine dagpenger",
    },
  ];
};

export async function loader({ request }: Route.LoaderArgs) {
  const decoratorFragments = await getDecoratorHTML();

  if (!decoratorFragments) {
    const errorMessage = "Klarte ikke hente dekoratør";

    logger.error(errorMessage);
    throw new Response(errorMessage, { status: 500 });
  }

  const sanityData = await sanityClient.fetch<ISanityData>(allTextsQuery, {
    baseLang: "nb",
    lang: "nb",
  });

  if (!sanityData) {
    const errorMessage = "Klarte ikke hente sanity data";

    logger.error(errorMessage);
    throw new Response(errorMessage, { status: 500 });
  }

  const session = await getSession(request);
  const abTesting = unleash.isEnabled("dp-mine-dagpenger-frontend.ab-testing");

  return {
    decoratorFragments,
    sanityData,
    session,
    featureFlags: {
      abTesting,
    },
    env: {
      DP_SOKNADSDIALOG_URL: getEnv("DP_SOKNADSDIALOG_URL"),
      BASE_PATH: getEnv("BASE_PATH"),
      APP_ENV: getEnv("APP_ENV"),
      UXSIGNALS_ENABLED: getEnv("UXSIGNALS_ENABLED"),
      UXSIGNALS_MODE: getEnv("UXSIGNALS_MODE"),
      SANITY_DATASET: getEnv("SANITY_DATASET"),
      FARO_URL: getEnv("FARO_URL"),
      IS_LOCALHOST: getEnv("IS_LOCALHOST"),
      DP_INNSYN_URL: getEnv("DP_INNSYN_URL"),
      OKONOMI_KONTOREGISTER_URL: getEnv("OKONOMI_KONTOREGISTER_URL"),
      PAW_ARBEIDSSOEKERREGISTERET_URL: getEnv("PAW_ARBEIDSSOEKERREGISTERET_URL"),
      SAF_URL: getEnv("SAF_URL"),
    },
  };
}

export function Layout({ children }: { children: React.ReactNode }) {
  const loaderData = useRouteLoaderData<typeof loader>("root");

  if (!loaderData) {
    logger.error("Klarte ikke hente loader data");
    return null;
  }

  const { decoratorFragments, env } = loaderData;

  useInjectDecoratorScript(decoratorFragments.DECORATOR_SCRIPTS);

  return (
    <html lang="nb">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {parse(decoratorFragments.DECORATOR_HEAD_ASSETS, { trim: true })}
        <Meta />
        <Links />
      </head>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.env = ${JSON.stringify(env)}`,
          }}
        />
        {parse(decoratorFragments.DECORATOR_HEADER, { trim: true })}
        {children}
        <ScrollRestoration />
        {parse(decoratorFragments.DECORATOR_FOOTER, { trim: true })}
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();

  logger.error("Application error: dp-mine-dagpenger-frontend :");
  logger.error(error);

  return (
    <html lang="nb">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <main id="maincontent" tabIndex={-1}>
          <Section>
            <SectionContent>
              <BodyShort>Vi har tekniske problemer akkurat nå. Prøve igjen om litt.</BodyShort>
            </SectionContent>
          </Section>
          <Scripts />
        </main>
      </body>
    </html>
  );
}
