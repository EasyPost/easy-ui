import { AriaLabelingProps, ItemProps } from "@react-types/shared";
import React, { ReactNode } from "react";
import {
  Item,
  ListProps,
  TreeProps,
  useListState,
  useTreeState,
} from "react-stately";

import styles from "./VerticalNav.module.scss";
import { IconSymbol } from "../types";

export type VerticalNavProps = AriaLabelingProps & {
  children: ReactNode;
  renderLogo?: () => ReactNode;
};

export function VerticalNav(props: VerticalNavProps) {
  const { children, renderLogo } = props;
  return (
    <nav className={styles.VerticalNav}>
      {renderLogo && <div className={styles.logo}>{renderLogo()}</div>}
      {children}
    </nav>
  );
}

export type VerticalNavNavProps = TreeProps<object>;

function VerticalNavNav(props: VerticalNavNavProps) {
  const state = useTreeState(props);
  return (
    <div className={styles.nav}>
      {[...state.collection].map((item, i) => {
        return (
          <div key={String(i)}>
            <div>{item.props.label}</div>
            <div>{item.rendered}</div>
          </div>
        );
      })}
    </div>
  );
}

export type VerticalNavNavItemProps = {
  children: ItemProps<object>["children"];
  textValue: ItemProps<object>["textValue"];
  label: string;
  iconSymbol?: IconSymbol;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function VerticalNavNavItem(_props: VerticalNavNavItemProps) {
  return null;
}
Object.assign(VerticalNavNavItem, Item);

export type VerticalNavSubnavProps = ListProps<object>;

function VerticalNavSubnav(props: VerticalNavSubnavProps) {
  const state = useListState(props);
  return (
    <div className={styles.subnav}>
      {[...state.collection].map((item, i) => (
        <div key={String(i)}>{item.rendered}</div>
      ))}
    </div>
  );
}

VerticalNav.Nav = VerticalNavNav;
VerticalNav.NavItem = VerticalNavNavItem;
VerticalNav.Subnav = VerticalNavSubnav;
