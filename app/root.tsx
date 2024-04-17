import parse from "html-react-parser";
import { LinksFunction, json } from "@remix-run/node";
import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from "@remix-run/react";
import navStyles from "@navikt/ds-css/dist/index.css?url";
import { hentDekoratorHtml } from "./dekorator/dekorator.server";
import { createClient } from "@sanity/client";
import { sanityConfig } from "./sanity/sanity.config";
import { ISanity } from "./sanity/sanity.types";
import { allTextsQuery } from "./sanity/sanity.query";
import indexStyle from "./index.css?url";

export const sanityClient = createClient(sanityConfig);

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: indexStyle },
  { rel: "stylesheet", href: navStyles },
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
    href: "/favicon.ico`,",
  },
];

export async function loader() {
  const fragments = await hentDekoratorHtml();
  const sanityTexts = await sanityClient.fetch<ISanity>(allTextsQuery, {
    baseLang: "nb",
    lang: "nb",
  });

  return json({
    fragments,
    sanityTexts,
    env: {
      BASE_PATH: process.env.BASE_PATH,
      USE_MSW: process.env.USE_MSW,
    },
  });
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { fragments } = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {parse(fragments.DECORATOR_STYLES, { trim: true })}
        <Meta />
        <Links />
      </head>
      <body>
        {parse(fragments.DECORATOR_HEADER, { trim: true })}
        {children}
        <ScrollRestoration />
        {parse(fragments.DECORATOR_FOOTER, { trim: true })}
        <Scripts />
        {parse(fragments.DECORATOR_SCRIPTS, { trim: true })}
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
