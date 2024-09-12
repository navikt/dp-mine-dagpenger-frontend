const appTextsFields = `{
  textId,
  valueText
}`;

const infoTextsFields = `{
  "slug": slug.current,
  body
}`;

const linkFields = `{
  linkId,
  linkText,
  linkUrl,
  linkDescription
}`;

export const appTextsGroq = `* [_type=="mineDagpengerAppText" && language==$baseLang]{
  ...coalesce(* [textId==^.textId && language==$lang][0]${appTextsFields}, ${appTextsFields})
}`;

const infoTextsGroq = `* [_type=="mineDagpengerRichText" && language==$baseLang]{
  ...coalesce(* [slug==^.slug && language==$lang][0]${infoTextsFields}, ${infoTextsFields})
}`;

const linksGroq = `* [_type=="mineDagpengerLink" && language==$baseLang]{
  ...coalesce(* [linkId==^.linkId && language==$lang][0]${linkFields}, ${linkFields})
}`;

export const allTextsQuery = `{
  "appTexts": ${appTextsGroq},
  "richTexts": ${infoTextsGroq},
  "links": ${linksGroq}
}`;
