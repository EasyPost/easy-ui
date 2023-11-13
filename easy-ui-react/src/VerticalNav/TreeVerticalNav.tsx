import React from "react";
import { TreeProps, useTreeState } from "react-stately";
import { classNames } from "../utilities/css";
import { TreeVerticalNavItem } from "./TreeVerticalNavItem";
import { VerticalNavTypeContext } from "./context";
import type { BaseVerticalNavProps } from "./types";

import styles from "./VerticalNav.module.scss";

export type TreeVerticalNavProps = BaseVerticalNavProps & TreeProps<object>;

export function TreeVerticalNav(props: TreeVerticalNavProps) {
  const { renderLogo } = props;
  const state = useTreeState({
    ...props,
    selectionMode: "single",
  });
  return (
    <VerticalNavTypeContext.Provider value="tree">
      <nav className={classNames(styles.VerticalNav, styles.tree)}>
        {renderLogo && <div className={styles.logo}>{renderLogo()}</div>}
        <div className={styles.nav}>
          {[...state.collection].map((item) => (
            <TreeVerticalNavItem key={item.key} state={state} item={item} />
          ))}
        </div>
      </nav>
    </VerticalNavTypeContext.Provider>
  );
}
