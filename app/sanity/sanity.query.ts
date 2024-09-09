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
    ...coalesce(* [_id==^._id && language == $lang][0]${appTextsFields},${appTextsFields})
  }`;

const infoTextsGroq = `* [_type=="mineDagpengerRichText" && language==$baseLang]{
  ...coalesce(* [_id==^._id && language == $lang][0]${infoTextsFields},${infoTextsFields})
  }`;

const linksGroq = `* [_type=="mineDagpengerLink" && language==$baseLang]{
  ...coalesce(* [_id==^._id && language == $lang][0]${linkFields},${linkFields})
  }`;

export const allTextsQuery = `{
  "appTexts": ${appTextsGroq},
  "richTexts": ${infoTextsGroq},
  "links": ${linksGroq}
}`;
