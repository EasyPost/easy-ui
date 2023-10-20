import React, { ReactNode } from "react";

import styles from "./Logo.module.scss";
import { classNames } from "../utilities/css";

export type LogoProps = {
  /**
   * The children of the <SearchNav.Logo> element. Should render passed in content from
   * user. Although it is content agnostic, it should be passed a logo or similar branding asset.
   */
  children: ReactNode;
};

export function Logo(props: LogoProps) {
  const { children } = props;

  return <div className={classNames(styles.logo)}>{children}</div>;
}

Logo.displayName = "SearchNav.Logo";
