import parse from "html-react-parser";
import { LinksFunction, json } from "@remix-run/node";
import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from "@remix-run/react";

import navStyles from "@navikt/ds-css/dist/index.css?url";
import indexStyle from "~/index.css?url";
import { hentDekoratorHtml } from "./dekorator/dekorator.server";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: indexStyle },
  { rel: "stylesheet", href: navStyles },
];

export async function loader() {
  const fragments = await hentDekoratorHtml();

  return json({
    fragments,
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
