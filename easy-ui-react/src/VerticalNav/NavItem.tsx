import { Node } from "@react-types/shared";
import React, { ReactNode } from "react";
import { mergeProps, useHover } from "react-aria";
import { Icon } from "../Icon";
import { Text } from "../Text";
import { classNames } from "../utilities/css";
import { useRouterLinkProps } from "../utilities/router";
import { ItemPropsForStately } from "./Item";

import styles from "./NavItem.module.scss";

type NavItemProps = {
  className?: string;
  expansionSlot?: ReactNode;
  isChildrenVisible: boolean;
  isExpanded?: boolean;
  isSelected: boolean;
  item: Node<object>;
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
    routerOptions: _routerOptions,
    ...linkProps
  } = item.props as ItemPropsForStately;
  const { hoverProps, isHovered } = useHover({});
  const routerLinkProps = useRouterLinkProps(
    item.props as ItemPropsForStately,
    As === "a",
  );
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
          {...mergeProps(hoverProps, linkProps, routerLinkProps)}
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
