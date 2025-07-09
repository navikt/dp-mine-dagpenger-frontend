import classnames from "classnames";
import styles from "./Section.module.css";
import type { ReactNode } from "react";

interface IProps {
  id?: string;
  highlighted?: boolean;
  children: ReactNode;
  smallSpacing?: boolean;
}

export function Section(props: IProps) {
  const { highlighted, children, smallSpacing } = props;

  return (
    <section
      className={classnames(styles.section, {
        [styles.highlighted]: highlighted,
        [styles.smallSpacing]: smallSpacing,
      })}
    >
      {children}
    </section>
  );
}
