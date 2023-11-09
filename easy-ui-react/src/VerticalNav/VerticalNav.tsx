import ArrowForwardIcon from "@easypost/easy-ui-icons/ArrowForwardIos";
import { AriaLabelingProps, Node } from "@react-types/shared";
import React, { ReactNode, createContext, useContext, useMemo } from "react";
import { mergeProps, useHover } from "react-aria";
import {
  ListProps,
  ListState,
  TreeProps,
  TreeState,
  useListState,
  useTreeState,
} from "react-stately";
import { Icon } from "../Icon";
import { Text } from "../Text";
import { UnstyledButton } from "../UnstyledButton";
import { classNames } from "../utilities/css";
import { NavItem } from "./Item";

import styles from "./VerticalNav.module.scss";

const SubnavLevelContext = createContext<number>(0);

export type ExpandedVerticalNavProps = TreeProps<object> &
  AriaLabelingProps & {
    children: ReactNode;
    renderLogo?: () => ReactNode;
  };

export function ExpandableVerticalNav(props: ExpandedVerticalNavProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { renderLogo } = props;
  const state = useTreeState({
    ...props,
    selectionMode: "single",
  });

  return (
    <nav className={styles.VerticalNav}>
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

export function VerticalNav(props: ExpandedVerticalNavProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { renderLogo } = props;
  const state = useListState({
    ...props,
    selectionMode: "single",
  });

  return (
    <nav className={styles.VerticalNav}>
      {renderLogo && <div className={styles.logo}>{renderLogo()}</div>}
      <div className={styles.nav}>
        {[...state.collection].map((item) => (
          <VerticalNavItemContent key={item.key} state={state} item={item} />
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

function VerticalNavItemContent({
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

export type ExpandedVerticalNavSubnavProps = ListProps<object>;

function ExpandedVerticalNavSubnav(props: ExpandedVerticalNavSubnavProps) {
  const levelContext = useContext(SubnavLevelContext);
  const level = useMemo(() => {
    return levelContext + 1;
  }, [levelContext]);
  const state = useListState({ ...props, selectionMode: "single" });
  const className = classNames(styles.subnav);
  return (
    <SubnavLevelContext.Provider value={level}>
      <div className={className} data-subnav-level={level}>
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
            <div key={String(i)} className={className}>
              <As
                className={styles.subnavItemLink}
                aria-current={isSelected ? "page" : undefined}
                {...mergeProps(linkProps)}
              >
                {level > 1 && <span className={dotClassName} />}
                <Text
                  variant={"body2"}
                  weight={isSelected && level === 1 ? "medium" : "normal"}
                >
                  {label}
                </Text>
              </As>
              {item.props.children && <div>{item.rendered}</div>}
            </div>
          );
        })}
      </div>
    </SubnavLevelContext.Provider>
  );
}

VerticalNav.Item = NavItem;
VerticalNav.Subnav = ExpandedVerticalNavSubnav;
