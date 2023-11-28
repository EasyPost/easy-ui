import React, { ReactNode } from "react";

import styles from "./Header.module.scss";

export type HeaderProps = {
  children: ReactNode;
};

export function Header(props: HeaderProps) {
  const { children } = props;
  return <div className={styles.Header}>{children}</div>;
}
