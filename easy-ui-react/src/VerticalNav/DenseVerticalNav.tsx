import { AriaLabelingProps, Node } from "@react-types/shared";
import React, { ReactNode } from "react";
import { mergeProps, useHover } from "react-aria";
import { ListProps, ListState, useListState } from "react-stately";
import { Icon } from "../Icon";
import { Text } from "../Text";
import { classNames } from "../utilities/css";
import { NavItem } from "./NavItem";
import { SubnavItem } from "./SubnavItem";

import styles from "./DenseVerticalNav.module.scss";

export type DenseVerticalNavNavProps = ListProps<object> &
  AriaLabelingProps & {
    children: ReactNode;
    renderLogo?: () => ReactNode;
  };

export function DenseVerticalNav(props: DenseVerticalNavNavProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { renderLogo } = props;
  const state = useListState({ ...props, selectionMode: "single" });
  return (
    <nav className={styles.DenseVerticalNav}>
      {renderLogo && <div className={styles.logo}>{renderLogo()}</div>}
      <div className={styles.nav}>
        {[...state.collection].map((item) => (
          <DenseVerticalNavItemContent
            key={item.key}
            state={state}
            item={item}
          />
        ))}
      </div>
    </nav>
  );
}

function DenseVerticalNavItemContent({
  state,
  item,
}: {
  state: ListState<object>;
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
  const { hoverProps, isHovered } = useHover({});
  const className = classNames(
    styles.navItem,
    isSelected && styles.navItemSelected,
    isHovered && styles.navItemHovered,
  );
  return (
    <div className={className}>
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
      {item.props.children && isSelected && <div>{item.rendered}</div>}
    </div>
  );
}

export type DenseVerticalNavSubnavProps = ListProps<object>;

function DenseVerticalNavSubnav(props: DenseVerticalNavSubnavProps) {
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

DenseVerticalNav.NavItem = NavItem;
DenseVerticalNav.Subnav = DenseVerticalNavSubnav;
DenseVerticalNav.SubnavItem = SubnavItem;
