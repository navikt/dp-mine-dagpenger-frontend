import { TypedObject } from "@portabletext/types";
import { ISanityAppText, ISanityRichText } from "~/sanity/sanity.types";
import { useTypedRouteLoaderData } from "./useTypedRouteLoaderData";

export function useSanity() {
  const { sanityTexts } = useTypedRouteLoaderData("root");

  function getAppText(textId: string): string {
    return (
      sanityTexts?.appTexts.find((appTexts: ISanityAppText) => appTexts.textId === textId)
        ?.valueText || textId
    );
  }

  function getRichText(slug: string): TypedObject | TypedObject[] {
    const richText = sanityTexts?.richTexts?.find((richText: ISanityRichText) => {
      return richText.slug === slug;
    });

    return richText?.body as any;
  }

  return {
    getAppText,
    getRichText,
  };
}
