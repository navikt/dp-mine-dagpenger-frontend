/// <reference types="vite/client" />
import type React from "react";

declare module "@navikt/ds-css/dist/index.css?url" {
  const url: string;
  export default url;
}

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "skyra-survey": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & { slug?: string };
    }
  }
}