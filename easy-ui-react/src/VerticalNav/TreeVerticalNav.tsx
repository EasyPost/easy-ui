import ArrowForwardIcon from "@easypost/easy-ui-icons/ArrowForwardIos";
import React from "react";
import { TreeProps, useTreeState } from "react-stately";
import { Icon } from "../Icon";
import { UnstyledButton } from "../UnstyledButton";
import { classNames } from "../utilities/css";
import { Container } from "./Container";
import { NavItem } from "./NavItem";
import { VerticalNavTypeContext } from "./context";
import type { BaseVerticalNavProps } from "./types";

import styles from "./VerticalNav.module.scss";

export type TreeVerticalNavProps = BaseVerticalNavProps & TreeProps<object>;

export function TreeVerticalNav(props: TreeVerticalNavProps) {
  const state = useTreeState({ ...props, selectionMode: "single" });
  return (
    <VerticalNavTypeContext.Provider value="tree">
      <Container {...props}>
        {[...state.collection].map((item) => {
          const isSelected = state.selectionManager.isSelected(item.key);
          const isExpanded = state.expandedKeys.has(item.key);
          const className = classNames(
            isSelected && styles.navItemTreeSelected,
            isExpanded && styles.navItemExpanded,
          );
          return (
            <NavItem
              key={item.key}
              item={item}
              className={className}
              isChildrenVisible={isExpanded}
              isSelected={isSelected}
              expansionSlot={
                item.props.children && (
                  <UnstyledButton
                    className={styles.navItemExpandBtn}
                    onPress={() => {
                      state.toggleKey(item.key);
                    }}
                  >
                    <Icon symbol={ArrowForwardIcon} size="2xs" />
                  </UnstyledButton>
                )
              }
            />
          );
        })}
      </Container>
    </VerticalNavTypeContext.Provider>
  );
}
