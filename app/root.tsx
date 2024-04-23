import navStyles from "@navikt/ds-css/dist/index.css?url";
import { Skeleton } from "@navikt/ds-react";
import { LinksFunction, MetaFunction, json } from "@remix-run/node";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";
import { createClient } from "@sanity/client";
import parse from "html-react-parser";
import { Fragment, Suspense } from "react";
import { getDecoratorHTML } from "./decorator/decorator.server";
import indexStyle from "./index.css?url";
import { sanityConfig } from "./sanity/sanity.config";
import { allTextsQuery } from "./sanity/sanity.query";
import { ISanity } from "./sanity/sanity.types";
import { useTypedRouteLoaderData } from "./hooks/useTypedRouteLoaderData";

export const sanityClient = createClient(sanityConfig);

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: navStyles },
  { rel: "stylesheet", href: indexStyle },
  {
    rel: "icon",
    type: "image/png",
    sizes: "32x32",
    href: "/favicon-32x32.png",
  },
  {
    rel: "icon",
    type: "image/png",
    sizes: "16x16",
    href: "/favicon-16x16.png",
  },
  {
    rel: "icon",
    type: "image/x-icon",
    href: "/favicon.ico",
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
      BASE_PATH: process.env.BASE_PATH,
      USE_MSW: process.env.USE_MSW,
    },
  });
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { decoratorFragments, env } = useTypedRouteLoaderData("root");

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Suspense fallback={<Fragment />}>{parse(decoratorFragments?.DECORATOR_STYLES)}</Suspense>
        <Meta />
        <Links />
      </head>
      <body>
        <Suspense fallback={<Skeleton variant="text" width="100%" height={300} />}>
          {parse(decoratorFragments?.DECORATOR_HEADER)}
        </Suspense>
        {children}
        <ScrollRestoration />
        <Suspense fallback={<Skeleton variant="text" width="100%" height={300} />}>
          {parse(decoratorFragments?.DECORATOR_FOOTER)}
        </Suspense>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.env = ${JSON.stringify(env)}`,
          }}
        />
        <Scripts />
        <Suspense fallback={<Fragment />}>{parse(decoratorFragments?.DECORATOR_SCRIPTS)}</Suspense>
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
