import React, { ReactNode } from "react";

import styles from "./Popover.module.scss";

export type PopoverHeaderProps = {
  /** The content of the popover header. Compose with `<Popover.Title />`. */
  children: ReactNode;
};

export function PopoverHeader(props: PopoverHeaderProps) {
  const { children } = props;
  return <div className={styles.header}>{children}</div>;
}
