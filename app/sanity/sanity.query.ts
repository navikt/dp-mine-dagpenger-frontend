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

export const appTextsGroq = `* [_type=="mineDagpengerAppText" && __i18n_lang==$baseLang]{
    ...coalesce(* [_id==^._id + "__i18n_" + $lang][0]${appTextsFields}, ${appTextsFields})
  }`;

const infoTextsGroq = `* [_type=="mineDagpengerRichText"  && __i18n_lang==$baseLang]{
  ...coalesce(* [_id==^._id + "__i18n_" + $lang][0]${infoTextsFields}, ${infoTextsFields})
  }`;

const linksGroq = `* [_type=="mineDagpengerLink"  && __i18n_lang==$baseLang]{
  ...coalesce(* [_id==^._id + "__i18n_" + $lang][0]${linkFields}, ${linkFields})
  }`;

export const allTextsQuery = `{
  "appTexts": ${appTextsGroq},
  "richTexts": ${infoTextsGroq},
  "links": ${linksGroq}
}`;
