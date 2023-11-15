import { Node } from "@react-types/shared";
import React, { ReactNode } from "react";
import { mergeProps, useHover } from "react-aria";
import { Icon } from "../Icon";
import { Text } from "../Text";
import { classNames } from "../utilities/css";
import { ItemPropsForStately } from "./Item";

import styles from "./NavItem.module.scss";

type NavItemProps = {
  className?: string;
  expansionSlot?: ReactNode;
  isChildrenVisible: boolean;
  isExpanded?: boolean;
  isSelected: boolean;
  item: Omit<Node<object>, "props"> & { props: ItemPropsForStately };
};

export function NavItem(props: NavItemProps) {
  const {
    className: classNameFromParent,
    expansionSlot,
    isChildrenVisible,
    isExpanded,
    isSelected,
    item,
  } = props;
  const {
    as: As = "a",
    children,
    icon,
    label,
    textValue: _textValue,
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
      <div className={styles.linkContainer}>
        <As
          className={styles.link}
          aria-current={isSelected ? "true" : undefined}
          aria-expanded={isExpanded ? "true" : undefined}
          {...mergeProps(hoverProps, linkProps)}
        >
          {icon && <Icon symbol={icon} />}
          <Text variant="subtitle2">{label}</Text>
        </As>
        {expansionSlot}
      </div>
      {children && isChildrenVisible && <>{item.rendered}</>}
    </div>
  );
}
