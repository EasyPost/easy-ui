import React from "react";
import { TreeProps, useTreeState } from "react-stately";
import { classNames } from "../utilities/css";
import { TreeVerticalNavItem } from "./TreeVerticalNavItem";
import { VerticalNavTypeContext } from "./context";
import type { BaseVerticalNavProps } from "./types";

import styles from "./VerticalNav.module.scss";

export type TreeVerticalNavProps = BaseVerticalNavProps & TreeProps<object>;

export function TreeVerticalNav(props: TreeVerticalNavProps) {
  const {
    renderBanner,
    renderLogo,
    supplementaryAction,
    children,
    ...labelingProps
  } = props;
  const state = useTreeState({ children, selectionMode: "single" });
  return (
    <VerticalNavTypeContext.Provider value="tree">
      <div className={classNames(styles.VerticalNav, styles.tree)}>
        {renderBanner && <div className={styles.banner}>{renderBanner()}</div>}
        {renderLogo && <div className={styles.logo}>{renderLogo()}</div>}
        <nav className={styles.nav} {...labelingProps}>
          {[...state.collection].map((item) => (
            <TreeVerticalNavItem key={item.key} state={state} item={item} />
          ))}
        </nav>
        {supplementaryAction && (
          <div className={styles.supplementaryActionContainer}>
            {supplementaryAction}
          </div>
        )}
      </div>
    </VerticalNavTypeContext.Provider>
  );
}
