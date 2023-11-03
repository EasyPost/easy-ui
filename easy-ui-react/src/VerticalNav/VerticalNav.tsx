import { AriaLabelingProps, ItemProps, Node } from "@react-types/shared";
import React, { ReactNode, createContext, useContext, useMemo } from "react";
import {
  Item,
  ListProps,
  TreeProps,
  TreeState,
  useListState,
  useTreeState,
} from "react-stately";
import { Icon } from "../Icon";
import { Text } from "../Text";
import { IconSymbol } from "../types";
import { classNames } from "../utilities/css";

import styles from "./VerticalNav.module.scss";

const VerticalSubnavLevelContext = createContext<number>(0);

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

export type VerticalNavNavItemProps = {
  children: ItemProps<object>["children"];
  label: string;
  iconSymbol: IconSymbol;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function VerticalNavNavItem(_props: VerticalNavNavItemProps) {
  return null;
}

// map label to text value
const originalGetCollectionNode = Item.getCollectionNode;
function getCollectionNode<T>(
  props: ItemProps<T>,
  context: object,
): Generator<PartialNode<T>> {
  return originalGetCollectionNode(
    { ...props, textValue: props.label },
    context,
  );
}

Object.assign(VerticalNavNavItem, Item, {
  getCollectionNode,
});

export type VerticalNavNavProps = TreeProps<object>;

function VerticalNavNav(props: VerticalNavNavProps) {
  const state = useTreeState({ ...props, selectionMode: "single" });
  return (
    <div className={styles.nav}>
      {[...state.collection].map((item) => (
        <VerticalNavNavItemRendered key={item.key} state={state} item={item} />
      ))}
    </div>
  );
}

function VerticalNavNavItemRendered({
  state,
  item,
}: {
  state: TreeState<object>;
  item: Node<object>;
}) {
  const { label, iconSymbol } = item.props;
  const isSelected = state.selectionManager.isSelected(item.key);
  const className = classNames(
    styles.navItem,
    isSelected && styles.navItemSelected,
  );
  return (
    <div className={className}>
      <div className={styles.navItemLabelRow}>
        <div>
          <Icon symbol={iconSymbol} />
        </div>
        <div>
          <Text variant="subtitle2">{label}</Text>
        </div>
      </div>
      {item.props.children && isSelected && <div>{item.rendered}</div>}
    </div>
  );
}

export type VerticalNavSubnavItemProps = {
  children?: ItemProps<object>["children"];
  label: string;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function VerticalNavSubnavItem(_props: VerticalNavSubnavItemProps) {
  return null;
}

Object.assign(VerticalNavSubnavItem, Item, {
  getCollectionNode,
});

export type VerticalNavSubnavProps = ListProps<object>;

function VerticalNavSubnav(props: VerticalNavSubnavProps) {
  const levelContext = useContext(VerticalSubnavLevelContext);
  const state = useListState({ ...props, selectionMode: "single" });
  const level = useMemo(() => {
    return levelContext + 1;
  }, [levelContext]);
  const className = classNames(
    styles.subnav,
    level === 1 && styles.firstLevel,
    level > 1 && styles.nextLevel,
  );
  return (
    <VerticalSubnavLevelContext.Provider value={level}>
      <div className={className}>
        {[...state.collection].map((item, i) => {
          const { label } = item.props;
          const isSelected = state.selectionManager.isSelected(item.key);
          const className = classNames(
            styles.subnavItem,
            isSelected && styles.subnavItemSelected,
            isSelected && level === 1 && styles.subnavItemSelectedFirstLevel,
            isSelected && level > 1 && styles.subnavItemSelectedNextLevel,
          );
          const dotClassName = classNames(
            styles.subnavItemDot,
            isSelected && level > 1 && styles.subnavItemDotVisible,
          );
          return (
            <div key={String(i)} className={className}>
              <span className={dotClassName} />
              <Text variant={level === 1 ? "subtitle2" : "body2"}>{label}</Text>
              {item.props.children && isSelected && (
                <div className={styles.subnavItemList}>{item.rendered}</div>
              )}
            </div>
          );
        })}
      </div>
    </VerticalSubnavLevelContext.Provider>
  );
}

VerticalNav.Nav = VerticalNavNav;
VerticalNav.NavItem = VerticalNavNavItem;
VerticalNav.Subnav = VerticalNavSubnav;
VerticalNav.SubnavItem = VerticalNavSubnavItem;
