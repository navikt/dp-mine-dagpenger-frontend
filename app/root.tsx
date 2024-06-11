import navStyles from "@navikt/ds-css/dist/index.css?url";
import { BodyShort } from "@navikt/ds-react";
import { LinksFunction, MetaFunction, json } from "@remix-run/node";
import { Links, Meta, Outlet, Scripts, ScrollRestoration, useRouteError } from "@remix-run/react";
import { createClient } from "@sanity/client";
import parse from "html-react-parser";
import { Section } from "./components/section/Section";
import { SectionContent } from "./components/section/SectionContent";
import { getDecoratorHTML } from "./decorator/decorator.server";
import { useTypedRouteLoaderData } from "./hooks/useTypedRouteLoaderData";
import indexStyle from "./index.css?url";
import { sanityConfig } from "./sanity/sanity.config";
import { allTextsQuery } from "./sanity/sanity.query";
import { ISanity } from "./sanity/sanity.types";
import { useInjectDecoratorScript } from "./hooks/useInjectDecoratorScript";
import { getEnv } from "./utils/env.utils";

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
      content: "Very cool app",
    },
    {
      name: "description",
      content: "This app is the best",
    },
  ];
};

export async function loader() {
  const decoratorFragments = await getDecoratorHTML();

  if (!decoratorFragments) throw json({ error: "Kunne ikke hente dekoratør" }, { status: 500 });

  const sanityTexts = await sanityClient.fetch<ISanity>(allTextsQuery, {
    baseLang: "nb",
    lang: "nb",
  });

  return json({
    decoratorFragments,
    sanityTexts,
    env: {
      DP_SOKNADSDIALOG_URL: getEnv("DP_SOKNADSDIALOG_URL"),
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
        {parse(decoratorFragments.DECORATOR_STYLES, { trim: true })}
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

  console.log("Application error: dp-mine-dagpenger-frontend ");
  console.log(error);

  return (
    <html lang="nb">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <main>
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
