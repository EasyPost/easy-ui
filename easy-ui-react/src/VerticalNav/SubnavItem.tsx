import React from "react";
import { mergeProps } from "react-aria";
import { ListState, Node } from "react-stately";
import { Text } from "../Text";
import { classNames } from "../utilities/css";
import { SubnavItemDot } from "./SubnavItemDot";
import { useVerticalNavType } from "./context";

import styles from "./SubnavItem.module.scss";

export type SubnavItemProps = {
  item: Node<object>;
  level: number;
  state: ListState<object>;
};

export function SubnavItem(props: SubnavItemProps) {
  const { item, level, state } = props;
  const type = useVerticalNavType();
  const {
    as: As = "a",
    label,
    textValue: _textValue,
    ...linkProps
  } = item.props;
  const isSelected = state.selectionManager.isSelected(item.key);
  const className = classNames(
    styles.SubnavItem,
    isSelected && styles.selected,
  );
  return (
    <div className={className}>
      <As
        className={styles.link}
        aria-current={isSelected ? "true" : undefined}
        {...mergeProps(linkProps)}
      >
        {(type === "list" || level > 1) && (
          <SubnavItemDot isCozy={type === "list"} isVisible={isSelected} />
        )}
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
