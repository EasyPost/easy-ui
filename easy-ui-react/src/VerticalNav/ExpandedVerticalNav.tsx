import { AriaLabelingProps, Node } from "@react-types/shared";
import React, { ReactNode } from "react";
import { mergeProps, useHover } from "react-aria";
import {
  ListProps,
  TreeProps,
  TreeState,
  useListState,
  useTreeState,
} from "react-stately";
import ArrowForwardIcon from "@easypost/easy-ui-icons/ArrowForward";
import { Icon } from "../Icon";
import { Text } from "../Text";
import { classNames } from "../utilities/css";
import { NavItem } from "./NavItem";
import { SubnavItem } from "./SubnavItem";

import styles from "./ExpandedVerticalNav.module.scss";
import { UnstyledButton } from "../UnstyledButton";

export type ExpandedVerticalNavProps = TreeProps<object> &
  AriaLabelingProps & {
    children: ReactNode;
    renderLogo?: () => ReactNode;
  };

export function ExpandedVerticalNav(props: ExpandedVerticalNavProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { renderLogo } = props;
  const state = useTreeState({ ...props, selectionMode: "single" });
  return (
    <nav className={styles.ExpandedVerticalNav}>
      {renderLogo && <div className={styles.logo}>{renderLogo()}</div>}
      <div className={styles.nav}>
        {[...state.collection].map((item) => (
          <ExpandedVerticalNavItemContent
            key={item.key}
            state={state}
            item={item}
          />
        ))}
      </div>
    </nav>
  );
}

function ExpandedVerticalNavItemContent({
  state,
  item,
}: {
  state: TreeState<object>;
  item: Node<object>;
}) {
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
    isSelected && styles.navItemSelected,
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
        <UnstyledButton
          onPress={() => {
            state.toggleKey(item.key);
          }}
        >
          <Icon symbol={ArrowForwardIcon} size="xs" />
        </UnstyledButton>
      </div>
      {item.props.children && isSelected && <div>{item.rendered}</div>}
    </div>
  );
}

export type ExpandedVerticalNavSubnavProps = ListProps<object>;

function ExpandedVerticalNavSubnav(props: ExpandedVerticalNavSubnavProps) {
  const state = useListState({ ...props, selectionMode: "single" });
  const className = classNames(styles.subnav);
  return (
    <div className={className}>
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
          <As
            key={String(i)}
            className={className}
            aria-current={isSelected ? "page" : undefined}
            {...mergeProps(linkProps)}
          >
            <span className={dotClassName} />
            <Text variant={"body2"}>{label}</Text>
          </As>
        );
      })}
    </div>
  );
}

ExpandedVerticalNav.NavItem = NavItem;
ExpandedVerticalNav.Subnav = ExpandedVerticalNavSubnav;
ExpandedVerticalNav.SubnavItem = SubnavItem;
