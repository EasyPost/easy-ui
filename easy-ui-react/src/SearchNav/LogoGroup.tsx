import React, { ReactNode } from "react";
import { Separator } from "./Separator";
import { classNames } from "../utilities/css";
import styles from "./LogoGroup.module.scss";
import { useInternalSearchNavContext } from "./context";

export type LogoGroupProps = {
  /**
   * The children of the <SearchNav.LogoGroup> element. Should render `<SearchNav.Logo>`
   * and `<SearchNav.Select>`
   */
  children: ReactNode;
};

/**
 *
 * @privateRemarks
 * This component doesn't directly use children and instead
 * reads the nodes it renders from context. This is so we can
 * efficiently share the same data across various configurations.
 *
 */
export function LogoGroup(_props: LogoGroupProps) {
  const { logo, title, selector } = useInternalSearchNavContext();

  return (
    <div className={classNames(styles.logoGroup)}>
      {logo}
      {title && (
        <>
          <Separator group="logo" />
          {title}
        </>
      )}
      {selector && (
        <>
          <Separator group="logo" />
          {selector}
        </>
      )}
    </div>
  );
}

LogoGroup.displayName = "SearchNav.LogoGroup";
