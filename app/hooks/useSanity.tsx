import { TypedObject } from "@portabletext/types";
import { useTypedRouteLoaderData } from "remix-typedjson";
import { ISanityAppText, ISanityLink, ISanityRichText } from "~/sanity/sanity.types";

export function useSanity() {
  const { sanityTexts } = useTypedRouteLoaderData("root");

  function getAppText(textId: string): string {
    return (
      sanityTexts?.appTexts.find((appTexts: ISanityAppText) => appTexts.textId === textId)
        ?.valueText || textId
    );
  }

  function getRichText(id: string): TypedObject | TypedObject[] {
    const richText = sanityTexts?.richTexts?.find((richText: ISanityRichText) => {
      return richText.textId === id;
    });

    return richText?.body as TypedObject | TypedObject[];
  }

  function getLink(linkId: string): ISanityLink {
    const link = sanityTexts?.links?.find((link: ISanityLink) => link.linkId === linkId) || {
      linkId: linkId,
      linkText: linkId,
      linkUrl: "",
      linkDescription: undefined,
    };

    return link as ISanityLink;
  }

  return {
    getAppText,
    getRichText,
    getLink,
  };
}
