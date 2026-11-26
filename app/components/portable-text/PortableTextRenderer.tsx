import { BodyLong, Heading } from "@navikt/ds-react";
import {
  PortableText,
  type PortableTextComponents,
  type PortableTextProps,
} from "@portabletext/react";
import styles from "./PortableTextRenderer.module.css";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <BodyLong>{children}</BodyLong>,
    h2: ({ children }) => (
      <Heading size="small" level="2">
        {children}
      </Heading>
    ),
    h3: ({ children }) => (
      <Heading size="xsmall" level="3">
        {children}
      </Heading>
    ),
    blockquote: ({ children }) => <blockquote>{children}</blockquote>,
  },
  list: {
    bullet: ({ children }) => <ul className={styles.list}>{children}</ul>,
    number: ({ children }) => <ol className={styles.list}>{children}</ol>,
  },
};

interface PortableTextRendererProps {
  value: PortableTextProps["value"];
}

export function PortableTextRenderer({ value }: PortableTextRendererProps) {
  return (
    <div className={styles.content}>
      <PortableText value={value} components={components} />
    </div>
  );
}
