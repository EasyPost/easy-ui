import React from "react";
import { ListProps, useListState } from "react-stately";
import { classNames } from "../utilities/css";
import { ListVerticalNavItem } from "./ListVerticalNavItem";
import { VerticalNavTypeContext } from "./context";
import type { BaseVerticalNavProps } from "./types";

import styles from "./VerticalNav.module.scss";

export type ListVerticalNavProps = BaseVerticalNavProps & ListProps<object>;

export function ListVerticalNav(props: ListVerticalNavProps) {
  const { renderLogo } = props;
  const state = useListState({ ...props, selectionMode: "single" });
  return (
    <VerticalNavTypeContext.Provider value="list">
      <nav className={classNames(styles.VerticalNav, styles.list)}>
        {renderLogo && <div className={styles.logo}>{renderLogo()}</div>}
        <div className={styles.nav}>
          {[...state.collection].map((item) => (
            <ListVerticalNavItem key={item.key} state={state} item={item} />
          ))}
        </div>
      </nav>
    </VerticalNavTypeContext.Provider>
  );
}
