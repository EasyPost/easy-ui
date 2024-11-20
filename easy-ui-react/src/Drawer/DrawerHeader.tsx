import React, { ReactNode } from "react";
import { classNames } from "../utilities/css";
import { useDrawerContext } from "./context";

import styles from "./Drawer.module.scss";
import { Text, TextProps } from "../Text";

export type DrawerHeaderProps = {
  /**
   * The content for the drawer header.
   */
  children: ReactNode;
};

export type DrawerTitleProps = TextProps;

export function DrawerHeader(props: DrawerHeaderProps) {
  const { children } = props;
  const drawerContext = useDrawerContext();
  const className = classNames(
    styles.header,
    drawerContext.isHeaderStuck && styles.stuck,
  );
  return <div className={className}>{children}</div>;
}

export function DrawerTitle(props: DrawerTitleProps) {
  const drawerContext = useDrawerContext();
  return <Text {...drawerContext.titleProps} {...props} />;
}
