import { Node } from "@react-types/shared";
import React, { ReactNode } from "react";
import { mergeProps, useHover } from "react-aria";
import { Icon } from "../Icon";
import { Text } from "../Text";
import { classNames } from "../utilities/css";

import styles from "./NavItem.module.scss";

type NavItemProps = {
  className?: string;
  expansionSlot?: ReactNode;
  isChildrenVisible: boolean;
  item: Node<object>;
  isSelected: boolean;
};

export function NavItem(props: NavItemProps) {
  const {
    className: classNameFromParent,
    expansionSlot,
    item,
    isSelected,
    isChildrenVisible,
  } = props;
  const {
    as: As = "a",
    label,
    iconSymbol,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    textValue,
    ...linkProps
  } = item.props;
  const { hoverProps, isHovered } = useHover({});
  const className = classNames(
    styles.NavItem,
    isHovered && styles.hovered,
    classNameFromParent,
  );
  return (
    <div className={className}>
      <div className={styles.labelWrap}>
        <As
          className={styles.label}
          aria-current={isSelected ? "true" : undefined}
          {...mergeProps(hoverProps, linkProps)}
        >
          {iconSymbol && <Icon symbol={iconSymbol} />}
          <Text variant="subtitle2">{label}</Text>
        </As>
        {expansionSlot}
      </div>
      {item.props.children && isChildrenVisible && item.rendered}
    </div>
  );
}
