import React, { ReactNode } from "react";

import styles from "./Drawer.module.scss";

type DrawerBanneredContentAreaProps = {
  /**
   * Content for drawer bannered content area.
   */
  children: ReactNode;
};

type DrawerStandaloneContentAreaProps = {
  /**
   * Content for drawer standalone content area.
   */
  children: ReactNode;
};

export function DrawerBanneredContentArea(
  props: DrawerBanneredContentAreaProps,
) {
  const { children } = props;
  return <div className={styles.banneredContentArea}>{children}</div>;
}

export function DrawerStandaloneContentArea(
  props: DrawerStandaloneContentAreaProps,
) {
  const { children } = props;
  return <div className={styles.standaloneContentArea}>{children}</div>;
}
