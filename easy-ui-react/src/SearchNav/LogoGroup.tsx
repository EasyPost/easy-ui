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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function LogoGroup(_props: LogoGroupProps) {
  const { logo, emphasizedText, selector } = useInternalSearchNavContext();

  return (
    <div className={classNames(styles.logoGroup)}>
      {logo}
      {emphasizedText && (
        <>
          <Separator group="logo" />
          {emphasizedText}
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
