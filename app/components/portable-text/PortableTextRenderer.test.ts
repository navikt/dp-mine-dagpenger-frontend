import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { PortableTextBlock } from "@portabletext/types";
import { expect, test } from "vitest";
import { PortableTextRenderer } from "./PortableTextRenderer";

function block(text: string, overrides: Partial<PortableTextBlock> = {}): PortableTextBlock {
  return {
    _type: "block",
    _key: text,
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: text, text, marks: [] }],
    ...overrides,
  };
}

test("rendrer avsnitt med BodyLong og bevarer lenker og utheving", () => {
  const value = block("Les mer", {
    markDefs: [{ _key: "lenke", _type: "link", href: "https://www.nav.no/dagpenger" }],
    children: [{ _type: "span", _key: "tekst", text: "Les mer", marks: ["lenke", "strong"] }],
  });

  const html = renderToStaticMarkup(createElement(PortableTextRenderer, { value }));

  expect(html).toMatch(/<p class="[^"]*aksel-body-long[^"]*">/);
  expect(html).toContain('href="https://www.nav.no/dagpenger"');
  expect(html).toContain("<strong>Les mer</strong>");
  expect(html.match(/<p\b/g)).toHaveLength(1);
});

test("bevarer overskriftsnivåer og bruker Aksel-overskrifter", () => {
  const value = [block("Overskrift", { style: "h2" }), block("Underoverskrift", { style: "h3" })];

  const html = renderToStaticMarkup(createElement(PortableTextRenderer, { value }));

  expect(html).toMatch(/<h2 class="[^"]*aksel-heading[^"]*">Overskrift<\/h2>/);
  expect(html).toMatch(/<h3 class="[^"]*aksel-heading[^"]*">Underoverskrift<\/h3>/);
});

test.each(["bullet", "number"] as const)("bevarer %s-lister og sitater", (listItem) => {
  const value = [
    block("Første punkt", { listItem, level: 1 }),
    block("Andre punkt", { listItem, level: 1 }),
    block("Sitat", { style: "blockquote" }),
  ];

  const html = renderToStaticMarkup(createElement(PortableTextRenderer, { value }));
  const tag = listItem === "bullet" ? "ul" : "ol";

  expect(html).toContain(`<${tag} class=`);
  expect(html).toContain("<li>Første punkt</li>");
  expect(html).toContain("<li>Andre punkt</li>");
  expect(html).toContain("<blockquote>Sitat</blockquote>");
});
