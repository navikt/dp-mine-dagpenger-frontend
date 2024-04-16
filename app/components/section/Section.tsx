import classnames from "classnames";
import React, { ReactNode } from "react";
import styles from "./Section.module.css";

interface IProps {
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
