import React, { ReactNode } from "react";
import { classNames } from "../utilities/css";

import styles from "./Drawer.module.scss";

export type DrawerBannerProps = {
  /**
   * Content of the drawer banner.
   */
  children: ReactNode;
};

export function DrawerBanner(props: DrawerBannerProps) {
  const className = classNames(styles.banner);
  return <div className={className}>{props.children}</div>;
}
