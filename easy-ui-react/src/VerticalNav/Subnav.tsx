import React, { createContext, useContext, useMemo } from "react";
import { Key } from "react-aria";
import { ListProps, useListState } from "react-stately";
import { SubnavItem } from "./SubnavItem";

import styles from "./Subnav.module.scss";

export type SubnavProps = {
  /**
   * The currently selected key in the navigation list.
   */
  selectedKey?: Key;

  /**
   * List of navigation items within the subnavigation.
   */
  children?: ListProps<object>["children"];
};

const SubnavLevelContext = createContext<number>(0);

/**
 * Represents a nested navigation within a navigation item.
 */
export function Subnav(props: SubnavProps) {
  const { selectedKey, ...listStateProps } = props;
  const levelContext = useContext(SubnavLevelContext);
  const level = useMemo(() => levelContext + 1, [levelContext]);
  const state = useListState({
    ...listStateProps,
    selectedKeys: selectedKey ? [selectedKey] : [],
    selectionMode: "single",
  });
  return (
    <SubnavLevelContext.Provider value={level}>
      <div className={styles.Subnav}>
        {[...state.collection].map((item, i) => (
          <SubnavItem key={String(i)} level={level} state={state} item={item} />
        ))}
      </div>
    </SubnavLevelContext.Provider>
  );
}
