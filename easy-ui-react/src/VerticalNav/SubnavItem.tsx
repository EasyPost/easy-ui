import React from "react";
import { mergeProps, useHover } from "react-aria";
import { ListState, Node } from "react-stately";
import { Text } from "../Text";
import { classNames } from "../utilities/css";
import { ItemPropsForStately } from "./Item";
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
    icon,
    textValue: _textValue,
    ...linkProps
  } = item.props as ItemPropsForStately;
  const isSelected = state.selectionManager.isSelected(item.key);
  const { hoverProps, isHovered } = useHover({});
  const className = classNames(
    styles.SubnavItem,
    isSelected && styles.selected,
    isHovered && styles.hovered,
  );
  if (icon) {
    throw new Error("icon is unsupported on <Subnav.Item />s");
  }
  return (
    <div className={className}>
      <As
        className={styles.link}
        aria-current={isSelected ? "true" : undefined}
        {...mergeProps(hoverProps, linkProps)}
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
