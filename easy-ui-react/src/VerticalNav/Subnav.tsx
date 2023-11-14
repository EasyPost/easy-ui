import React, { createContext, useContext, useMemo } from "react";
import { ListProps, useListState } from "react-stately";
import { SubnavItem } from "./SubnavItem";

import styles from "./Subnav.module.scss";

const SubnavLevelContext = createContext<number>(0);

export type SubnavProps = ListProps<object>;

export function Subnav(props: SubnavProps) {
  const levelContext = useContext(SubnavLevelContext);
  const level = useMemo(() => levelContext + 1, [levelContext]);
  const state = useListState({ ...props, selectionMode: "single" });
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
