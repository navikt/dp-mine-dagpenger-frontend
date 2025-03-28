import navStyles from "@navikt/ds-css/dist/index.css?url";
import { BodyShort } from "@navikt/ds-react";
import { LinksFunction, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Links, Meta, Outlet, Scripts, ScrollRestoration, useRouteError } from "@remix-run/react";
import { createClient } from "@sanity/client";
import parse from "html-react-parser";
import { typedjson, useTypedRouteLoaderData } from "remix-typedjson";
import { Section } from "./components/section/Section";
import { SectionContent } from "./components/section/SectionContent";
import { getDecoratorHTML } from "./models/decorator.server";
import { useInjectDecoratorScript } from "./hooks/useInjectDecoratorScript";
import indexStyle from "./index.css?url";
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

export async function loader({ request }: LoaderFunctionArgs) {
  const decoratorFragments = await getDecoratorHTML();

  if (!decoratorFragments) {
    logger.error("Klarte ikke hente dekoratør");
    throw typedjson({ error: "Klarte ikke hente dekoratør" }, { status: 500 });
  }

  const sanityData = await sanityClient.fetch<ISanityData>(allTextsQuery, {
    baseLang: "nb",
    lang: "nb",
  });

  if (!sanityData) {
    logger.error("Klarte ikke hente sanity data");
    throw typedjson({ error: "Klarte ikke hente sanity data" }, { status: 500 });
  }

  const session = await getSession(request);
  const abTesting = unleash.isEnabled("dp-mine-dagpenger-frontend.ab-testing");

  return typedjson({
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
      DP_INNSYN_URL: getEnv("DP_INNSYN_URL"),
      OKONOMI_KONTOREGISTER_URL: getEnv("OKONOMI_KONTOREGISTER_URL"),
      PAW_ARBEIDSSOEKERREGISTERET_URL: getEnv("PAW_ARBEIDSSOEKERREGISTERET_URL"),
      SAF_URL: getEnv("SAF_URL"),
    },
  });
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { decoratorFragments, env } = useTypedRouteLoaderData("root");

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
