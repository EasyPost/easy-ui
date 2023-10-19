import React, { ReactNode, useMemo } from "react";
import { Separator } from "./Separator";
import { flattenChildren } from "../utilities/react";
import { classNames } from "../utilities/css";

import styles from "./LogoGroup.module.scss";

export type LogoGroupProps = {
  /**
   * The children of the <SearchNav.LogoGroup> element. Should render `<SearchNav.Logo>`
   * and `<SearchNav.Select>`
   */
  children: ReactNode;
};

export function LogoGroup(props: LogoGroupProps) {
  const { children } = props;

  const items = useMemo(() => {
    return flattenChildren(children);
  }, [children]);

  const logo = items[0];
  const select = items.length === 2 ? items[1] : null;

  return (
    <div className={classNames(styles.logoGroup)}>
      {logo}
      {select && (
        <>
          <Separator group="logo" />
          {select}
        </>
      )}
    </div>
  );
}

LogoGroup.displayName = "LogoGroup";
