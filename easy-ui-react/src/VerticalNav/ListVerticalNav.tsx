import React from "react";
import { ListProps, useListState } from "react-stately";
import { classNames } from "../utilities/css";
import { ListVerticalNavItem } from "./ListVerticalNavItem";
import { VerticalNavTypeContext } from "./context";
import type { BaseVerticalNavProps } from "./types";

import styles from "./VerticalNav.module.scss";

export type ListVerticalNavProps = BaseVerticalNavProps & ListProps<object>;

export function ListVerticalNav(props: ListVerticalNavProps) {
  const {
    renderBanner,
    renderLogo,
    supplementaryAction,
    ["aria-label"]: ariaLabel,
    ["aria-labelledby"]: ariaLabelledBy,
    ["aria-describedby"]: ariaDescribedBy,
    ["aria-details"]: ariaDetails,
    ...listProps
  } = props;
  const state = useListState({ ...listProps, selectionMode: "single" });
  return (
    <VerticalNavTypeContext.Provider value="list">
      <div className={classNames(styles.VerticalNav, styles.list)}>
        {renderBanner && <div className={styles.banner}>{renderBanner()}</div>}
        {renderLogo && <div className={styles.logo}>{renderLogo()}</div>}
        <nav
          className={styles.nav}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
          aria-details={ariaDetails}
        >
          {[...state.collection].map((item) => (
            <ListVerticalNavItem key={item.key} state={state} item={item} />
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
