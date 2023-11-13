import React from "react";
import { ListProps, useListState } from "react-stately";
import { ListVerticalNavItem } from "./ListVerticalNavItem";
import type { BaseVerticalNavProps } from "./types";

import styles from "./VerticalNav.module.scss";

export type ListVerticalNavProps = BaseVerticalNavProps & ListProps<object>;

export function ListVerticalNav(props: ListVerticalNavProps) {
  const { renderLogo } = props;
  const state = useListState({
    ...props,
    selectionMode: "single",
  });
  return (
    <nav className={styles.VerticalNav}>
      {renderLogo && <div className={styles.logo}>{renderLogo()}</div>}
      <div className={styles.nav}>
        {[...state.collection].map((item) => (
          <ListVerticalNavItem key={item.key} state={state} item={item} />
        ))}
      </div>
    </nav>
  );
}
