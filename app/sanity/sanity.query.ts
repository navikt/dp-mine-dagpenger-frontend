const appTextFields = `{
  textId,
  valueText
}`;

const richTextFields = `{
  textId,
  body
}`;

const linkFields = `{
  linkId,
  linkText,
  linkUrl,
  linkDescription
}`;

export const appTextsGroq = `* [_type=="mineDagpengerAppText" && language==$baseLang]{
  ...coalesce(* [textId==^.textId && language==$lang][0]${appTextFields}, ${appTextFields})
}`;

const richTextsGroq = `* [_type=="mineDagpengerRichText" && language==$baseLang]{
  ...coalesce(* [textId==^.textId && language==$lang][0]${richTextFields}, ${richTextFields})
}`;

const linksGroq = `* [_type=="mineDagpengerLink" && language==$baseLang]{
  ...coalesce(* [linkId==^.linkId && language==$lang][0]${linkFields}, ${linkFields})
}`;

export const allTextsQuery = `{
  "appTexts": ${appTextsGroq},
  "richTexts": ${richTextsGroq},
  "links": ${linksGroq}
}`;
