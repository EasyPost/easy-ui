import { AriaLabelingProps, Node } from "@react-types/shared";
import React, { ReactNode } from "react";
import { mergeProps, useHover } from "react-aria";
import { TreeProps, TreeState, useTreeState } from "react-stately";
import { Icon } from "../Icon";
import { Text } from "../Text";
import { classNames } from "../utilities/css";
import { NavItem } from "./Item";

import styles from "./SimpleVerticalNav.module.scss";

export type SimpleVerticalNavNavProps = TreeProps<object> &
  AriaLabelingProps & {
    children: ReactNode;
    renderLogo?: () => ReactNode;
  };

export function SimpleVerticalNav(props: SimpleVerticalNavNavProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { renderLogo, children, ...labelProps } = props;
  const state = useTreeState({ ...props, selectionMode: "single" });
  return (
    <nav className={styles.SimpleVerticalNav} {...labelProps}>
      {renderLogo && <div className={styles.logo}>{renderLogo()}</div>}
      <div className={styles.nav}>
        {[...state.collection].map((item) => (
          <SimpleVerticalNavItemContent
            key={item.key}
            state={state}
            item={item}
          />
        ))}
      </div>
    </nav>
  );
}

function SimpleVerticalNavItemContent({
  state,
  item,
}: {
  state: TreeState<object>;
  item: Node<object>;
}) {
  const { as: As = "a", label, iconSymbol, ...linkProps } = item.props;
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
        <div>
          <Icon symbol={iconSymbol} />
        </div>
        <div>
          <Text variant="subtitle2">{label}</Text>
        </div>
      </As>
      {item.props.children && isSelected && <div>{item.rendered}</div>}
    </div>
  );
}

SimpleVerticalNav.Item = NavItem;
