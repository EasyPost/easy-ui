import React, { ReactNode } from "react";

import styles from "./Popover.module.scss";

export type PopoverFooterProps = {
  /** The content of the popover footer. */
  children: ReactNode;
};

export function PopoverFooter(props: PopoverFooterProps) {
  const { children } = props;
  return <div className={styles.footer}>{children}</div>;
}
