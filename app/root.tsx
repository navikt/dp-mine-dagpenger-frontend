import { BodyShort } from "@navikt/ds-react";
import { createClient } from "@sanity/client";
import parse from "html-react-parser";
import {
  data,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
} from "react-router";
import type { Route } from "./+types/root";
// import { ClientScript } from "./components/ClientScript";
import { Section } from "./components/section/Section";
import { SectionContent } from "./components/section/SectionContent";
import { useInjectDecoratorScript } from "./hooks/useInjectDecoratorScript";
import { getDecoratorHTML } from "./models/decorator.server";
import { getArbeidssoekerPerioder } from "./models/getArbeidssoekerPerioder.server";
import { getBankAccountNumber } from "./models/getBankAccountNumber.server";
import { getFullforteSoknader } from "./models/getFullfortSoknader.server";
import { getOrkestratorSoknader } from "./models/getOrkestratorSoknader.server";
import { getPaabegynteSoknader } from "./models/getPaabegynteSoknader.server";
import { getSAFJournalposter } from "./models/getSAFJournalposter.server";
import { getSession } from "./models/getSession.server";
import { sanityConfig } from "./sanity/sanity.config";
import { allTextsQuery } from "./sanity/sanity.query";
import type { ISanityData } from "./sanity/sanity.types";
import { unleash } from "./unleash";
import { getEnv } from "./utils/env.utils";
import { logger } from "./utils/logger.utils";

import navStyles from "@navikt/ds-css/dist/index.css?url";
import indexStyle from "./index.css?url";

export const sanityClient = createClient(sanityConfig);

export const links = () => [
  { rel: "stylesheet", href: navStyles },
  { rel: "stylesheet", href: indexStyle },
  {
    rel: "icon",
    type: "image/png",
    sizes: "32x32",
    href: `${
      getEnv("IS_LOCALHOST") === "true"
        ? ""
        : "https://cdn.nav.no/teamdagpenger/dp-mine-dagpenger-frontend/client"
    }/favicon-32x32.png`,
  },
  {
    rel: "icon",
    type: "image/png",
    sizes: "16x16",
    href: `${
      getEnv("IS_LOCALHOST") === "true"
        ? ""
        : "https://cdn.nav.no/teamdagpenger/dp-mine-dagpenger-frontend/client"
    }/favicon-16x16.png`,
  },
  {
    rel: "icon",
    type: "image/x-icon",
    href: `${
      getEnv("IS_LOCALHOST") === "true"
        ? ""
        : "https://cdn.nav.no/teamdagpenger/dp-mine-dagpenger-frontend/client"
    }/favicon.ico`,
  },
];

export const meta = () => {
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
    logger.error("Klarte ikke hente dekoratør");
    throw new Error("Klarte ikke hente dekoratør");
  }

  const sanityData = await sanityClient.fetch<ISanityData>(allTextsQuery, {
    baseLang: "nb",
    lang: "nb",
  });

  if (!sanityData) {
    logger.error("Klarte ikke hente sanity data");
    throw new Error("Klarte ikke hente sanity data");
  }

  const session = await getSession(request);
  const abTesting = unleash.isEnabled("dp-mine-dagpenger-frontend.ab-testing");

  const fullforteSoknader = await getFullforteSoknader(request);
  const paabegynteSoknader = await getPaabegynteSoknader(request);
  const orkestratorSoknader = await getOrkestratorSoknader(request);
  const arbeidsseokerPerioder = await getArbeidssoekerPerioder(request);
  const bankAccountNumber = await getBankAccountNumber(request);
  const journalposter = await getSAFJournalposter(request);

  return data({
    decoratorFragments,
    sanityData,
    session,
    featureFlags: {
      abTesting,
    },
    env: {
      IS_LOCALHOST: getEnv("IS_LOCALHOST"),
      BASE_PATH: getEnv("BASE_PATH"),
      DP_SOKNADSDIALOG_URL: getEnv("DP_SOKNADSDIALOG_URL"),
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
    fullforteSoknader,
    paabegynteSoknader,
    orkestratorSoknader,
    arbeidsseokerPerioder,
    bankAccountNumber,
    journalposter,
  });
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { decoratorFragments, env } = useLoaderData();
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
        {parse(decoratorFragments.DECORATOR_HEADER, { trim: true })}
        {children}
        <ScrollRestoration />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.env = ${JSON.stringify(env)}`,
          }}
        />
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
