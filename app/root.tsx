import navStyles from "@navikt/ds-css/dist/index.css?url";
import { LinksFunction, json } from "@remix-run/node";
import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from "@remix-run/react";
import { createClient } from "@sanity/client";
import parse from "html-react-parser";
import { getDekoratorHTML } from "./dekorator/dekorator.server";
import indexStyle from "./index.css?url";
import { sanityConfig } from "./sanity/sanity.config";
import { ISanity } from "./sanity/sanity.types";
import { allTextsQuery } from "./sanity/sanity.query";

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

export async function loader() {
  const dekoratorHTML = await getDekoratorHTML();

  if (!dekoratorHTML) throw json({ error: "Kunne ikke hente dekoratør" }, { status: 500 });

  const sanityTexts = await sanityClient.fetch<ISanity>(allTextsQuery, {
    baseLang: "nb",
    lang: "nb",
  });

  return json({
    dekoratorHTML,
    sanityTexts,
    env: {
      BASE_PATH: process.env.BASE_PATH,
      USE_MSW: process.env.USE_MSW,
    },
  });
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { dekoratorHTML } = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {parse(dekoratorHTML?.DECORATOR_STYLES)}
        <Meta />
        <Links />
      </head>
      <body>
        {parse(dekoratorHTML?.DECORATOR_HEADER)}
        {children}
        <ScrollRestoration />
        {parse(dekoratorHTML?.DECORATOR_FOOTER)}
        <Scripts />
        {parse(dekoratorHTML?.DECORATOR_SCRIPTS)}
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
