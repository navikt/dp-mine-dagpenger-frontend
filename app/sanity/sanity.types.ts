import { TypedObject } from "@portabletext/types";

export interface ISanityHelpText {
  title?: string;
  body: TypedObject | TypedObject[];
}

export interface ISanityAppText {
  textId: string;
  valueText: string;
}

export interface ISanityRichText {
  slug: string;
  body: TypedObject | TypedObject[];
}

export interface ISanityLink {
  linkId: string;
  linkText: string;
  linkUrl: string;
  linkDescription: string;
}

export interface ISanity {
  appTexts: ISanityAppText[];
  richTexts: ISanityRichText[];
  links: ISanityLink[];
}
