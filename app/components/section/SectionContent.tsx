import classnames from "classnames";
import type { ReactNode } from "react";
import styles from "./Section.module.css";

interface IProps {
  fullWidth?: boolean;
  children: ReactNode;
}

export function SectionContent(props: IProps) {
  const { fullWidth, children } = props;

  return (
    <div className={styles.gridContainer}>
      <div
        className={classnames(styles.defaultWidth, {
          [styles.fullWidth]: fullWidth,
        })}
      >
        {children}
      </div>
    </div>
  );
}
