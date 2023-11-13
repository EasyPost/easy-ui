import React from "react";
import { mergeProps } from "react-aria";
import { ListState, Node } from "react-stately";
import { Text } from "../Text";
import { classNames } from "../utilities/css";
import { useVerticalNavType } from "./context";

import styles from "./VerticalNav.module.scss";

export type SubnavItemProps = {
  level: number;
  state: ListState<object>;
  item: Node<object>;
};

export function SubnavItem({ level, state, item }: SubnavItemProps) {
  const type = useVerticalNavType();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { as: As = "a", label, textValue, ...linkProps } = item.props;
  const isSelected = state.selectionManager.isSelected(item.key);
  const className = classNames(
    styles.subnavItem,
    isSelected && styles.subnavItemSelected,
  );
  const dotClassName = classNames(
    styles.subnavItemDot,
    type === "list" && styles.subnavItemDotCozy,
    isSelected && styles.subnavItemDotVisible,
  );
  return (
    <div className={className}>
      <As
        className={styles.subnavItemLink}
        aria-current={isSelected ? "true" : undefined}
        {...mergeProps(linkProps)}
      >
        {(type === "list" || level > 1) && <span className={dotClassName} />}
        <Text
          variant={"body2"}
          weight={isSelected && level === 1 ? "medium" : "normal"}
        >
          {label}
        </Text>
      </As>
      {item.props.children && item.rendered}
    </div>
  );
}
