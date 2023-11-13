import ArrowForwardIcon from "@easypost/easy-ui-icons/ArrowForwardIos";
import { Node } from "@react-types/shared";
import React from "react";
import { mergeProps, useHover } from "react-aria";
import { TreeState } from "react-stately";
import { Icon } from "../Icon";
import { Text } from "../Text";
import { UnstyledButton } from "../UnstyledButton";
import { classNames } from "../utilities/css";

import styles from "./VerticalNav.module.scss";

type TreeVerticalNavItemProps = {
  state: TreeState<object>;
  item: Node<object>;
};

export function TreeVerticalNavItem(props: TreeVerticalNavItemProps) {
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
  const isExpanded = state.expandedKeys.has(item.key);
  const { hoverProps, isHovered } = useHover({});
  const className = classNames(
    styles.navItem,
    isSelected && styles.navItemTreeSelected,
    isExpanded && styles.navItemExpanded,
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
        {item.props.children && (
          <UnstyledButton
            className={styles.navItemExpandBtn}
            onPress={() => {
              state.toggleKey(item.key);
            }}
          >
            <Icon symbol={ArrowForwardIcon} size="2xs" />
          </UnstyledButton>
        )}
      </div>
      {item.props.children && isExpanded && <div>{item.rendered}</div>}
    </div>
  );
}
