import { Node } from "@react-types/shared";
import React from "react";
import { mergeProps, useHover } from "react-aria";
import { ListState } from "react-stately";
import { Icon } from "../Icon";
import { Text } from "../Text";
import { classNames } from "../utilities/css";

import styles from "./VerticalNav.module.scss";

export type ListVerticalNavItemProps = {
  state: ListState<object>;
  item: Node<object>;
};

export function ListVerticalNavItem(props: ListVerticalNavItemProps) {
  const { item, state } = props;
  const {
    as: As = "a",
    label,
    iconSymbol,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    textValue,
    ...linkProps
  } = item.props;
  const isSelected = state.selectionManager.isSelected(item.key);
  const { hoverProps, isHovered } = useHover({});
  const className = classNames(
    styles.navItem,
    isSelected && styles.navItemListSelected,
    isHovered && styles.navItemHovered,
  );
  return (
    <div className={className}>
      <div className={styles.navItemLabelWrap}>
        <As
          className={styles.navItemLabel}
          aria-current={isSelected ? "page" : undefined}
          {...mergeProps(hoverProps, linkProps)}
        >
          {iconSymbol && (
            <div>
              <Icon symbol={iconSymbol} />
            </div>
          )}
          <div>
            <Text variant="subtitle2">{label}</Text>
          </div>
        </As>
      </div>
      {item.props.children && isSelected && <div>{item.rendered}</div>}
    </div>
  );
}
