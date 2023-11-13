import React, { createContext, useContext, useMemo } from "react";
import { mergeProps } from "react-aria";
import { ListProps, useListState } from "react-stately";
import { Text } from "../Text";
import { classNames } from "../utilities/css";

import styles from "./VerticalNav.module.scss";

const SubnavLevelContext = createContext<number>(0);

export type SubnavProps = ListProps<object>;

export function Subnav(props: SubnavProps) {
  const levelContext = useContext(SubnavLevelContext);
  const level = useMemo(() => {
    return levelContext + 1;
  }, [levelContext]);
  const state = useListState({ ...props, selectionMode: "single" });
  const className = classNames(styles.subnav);
  return (
    <SubnavLevelContext.Provider value={level}>
      <div className={className} data-subnav-level={level}>
        {[...state.collection].map((item, i) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { as: As = "a", label, textValue, ...linkProps } = item.props;
          const isSelected = state.selectionManager.isSelected(item.key);
          const className = classNames(
            styles.subnavItem,
            isSelected && styles.subnavItemSelected,
          );
          const dotClassName = classNames(
            styles.subnavItemDot,
            isSelected && styles.subnavItemDotVisible,
          );
          return (
            <div key={String(i)} className={className}>
              <As
                className={styles.subnavItemLink}
                aria-current={isSelected ? "page" : undefined}
                {...mergeProps(linkProps)}
              >
                {level > 1 && <span className={dotClassName} />}
                <Text
                  variant={"body2"}
                  weight={isSelected && level === 1 ? "medium" : "normal"}
                >
                  {label}
                </Text>
              </As>
              {item.props.children && <div>{item.rendered}</div>}
            </div>
          );
        })}
      </div>
    </SubnavLevelContext.Provider>
  );
}
