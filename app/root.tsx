import { BodyShort } from "@navikt/ds-react";
import type { DecoratorElements } from "@navikt/nav-dekoratoren-moduler/ssr";
import { createClient } from "@sanity/client";
import parse from "html-react-parser";
import {
  Links,
  LoaderFunctionArgs,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
  type LinksFunction,
} from "react-router";
import { Section } from "./components/section/Section";
import { SectionContent } from "./components/section/SectionContent";
import { useInjectDecoratorScript } from "./hooks/useInjectDecoratorScript";
import { getDecoratorHTML } from "./models/decorator.server";
import { getHarAktivDagpengerett } from "./models/getAktivDagpengerett.server";
import { getBankAccountNumber, type IKonto } from "./models/getBankAccountNumber.server";
import { getSAFJournalposter } from "./models/getSAFJournalposter.server";
import { getSession, type ISessionData } from "./models/getSession.server";
import { getSoknader, type ISoknad } from "./models/getSoknader.server";
import {
  hentArbeidssøkerStatus,
  type ArbeidssøkerStatus,
} from "./models/hentArbeidssøkerStatus.server";
import type { INetworkResponse } from "./models/networkResponse";
import { sanityConfig } from "./sanity/sanity.config";
import { allTextsQuery } from "./sanity/sanity.query";
import type { ISanityData } from "./sanity/sanity.types";
import { unleash } from "./unleash";
import { getEnv } from "./utils/env.utils";
import { logger } from "./utils/logger.utils";
import type { IJournalpost } from "./utils/safJournalposter.utils";

//@ts-expect-error -- mangler typedeklarasjoner for css-import
import akselStyles from "@navikt/ds-css/dist/index.css?url";
import indexStyles from "./index.css?url";

export const sanityClient = createClient(sanityConfig);

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: akselStyles },
  { rel: "stylesheet", href: indexStyles },
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

export type RootLoaderType = {
  decoratorFragments: DecoratorElements;
  sanityData: ISanityData;
  session: INetworkResponse<ISessionData>;
  featureFlags: {
    abTesting: boolean;
  };
  env: {
    IS_LOCALHOST: string;
    BASE_PATH: string;
    DP_SOKNADSDIALOG_URL: string;
    DP_BRUKERDIALOG_URL: string;
    APP_ENV: string;
    UXSIGNALS_ENABLED: string;
    UXSIGNALS_MODE: string;
    SANITY_DATASET: string;
    FARO_URL: string;
    OKONOMI_KONTOREGISTER_URL: string;
    PAW_ARBEIDSSOEKERREGISTERET_URL: string;
    SAF_URL: string;
  };
  soknader: INetworkResponse<ISoknad[]>;
  arbeidssøkerStatus: ArbeidssøkerStatus;
  bankAccountNumber: INetworkResponse<IKonto>;
  journalposter: INetworkResponse<IJournalpost[]>;
  aktivDagpengerett: INetworkResponse<boolean>;
};

export async function loader({ request }: LoaderFunctionArgs): Promise<RootLoaderType> {
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
  const [soknader, arbeidssøkerStatus, bankAccountNumber, journalposter, aktivDagpengerett] =
    await Promise.all([
      getSoknader(request),
      hentArbeidssøkerStatus(request),
      getBankAccountNumber(request),
      getSAFJournalposter(request),
      getHarAktivDagpengerett(request),
    ]);

  return {
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
      DP_BRUKERDIALOG_URL: getEnv("DP_BRUKERDIALOG_URL"),
      APP_ENV: getEnv("APP_ENV"),
      UXSIGNALS_ENABLED: getEnv("UXSIGNALS_ENABLED"),
      UXSIGNALS_MODE: getEnv("UXSIGNALS_MODE"),
      SANITY_DATASET: getEnv("SANITY_DATASET"),
      FARO_URL: getEnv("FARO_URL"),
      OKONOMI_KONTOREGISTER_URL: getEnv("OKONOMI_KONTOREGISTER_URL"),
      PAW_ARBEIDSSOEKERREGISTERET_URL: getEnv("PAW_ARBEIDSSOEKERREGISTERET_URL"),
      SAF_URL: getEnv("SAF_URL"),
    },
    soknader,
    arbeidssøkerStatus,
    bankAccountNumber,
    journalposter,
    aktivDagpengerett,
  };
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { decoratorFragments, env } = useLoaderData();
  const { DECORATOR_HEAD_ASSETS, DECORATOR_SCRIPTS, DECORATOR_HEADER, DECORATOR_FOOTER } =
    decoratorFragments;

  useInjectDecoratorScript(DECORATOR_SCRIPTS);

  return (
    <html lang="nb">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {parse(DECORATOR_HEAD_ASSETS, { trim: true })}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.SKYRA_CONFIG = { org: 'arbeids-og-velferdsetaten-nav' }`,
          }}
        />
        <script src="https://survey.skyra.no/skyra-survey.js" async></script>
        <Meta />
        <Links />
      </head>
      <body>
        <div dangerouslySetInnerHTML={{ __html: DECORATOR_HEADER }} />
        {children}
        <ScrollRestoration />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.env = ${JSON.stringify(env)}`,
          }}
        />
        <div dangerouslySetInnerHTML={{ __html: DECORATOR_FOOTER }} />
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
