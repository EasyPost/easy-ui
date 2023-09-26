import React, {
  ComponentProps,
  ElementType,
  MutableRefObject,
  ReactNode,
  useRef,
} from "react";
import { mergeProps, useFocusRing, useHover } from "react-aria";
import { classNames } from "../utilities/css";
import { useTabs } from "./context";
import { useIndicatorSizing } from "./useIndicatorSizing";
import { useScrollIntoViewIfNeeded } from "./useScrollIntoViewIfNeeded";

import styles from "./TabsItem.module.scss";

export const SCROLL_PADDING = 32;

type TabsItemProps<T extends ElementType = "span"> = ComponentProps<T> & {
  outerComponent: "span" | "div" | "li";
  tabRef?: MutableRefObject<null>;
  as?: T;
  children: ReactNode;
  isSelected?: boolean;
};

export function TabsItem<T extends ElementType = "span">(
  props: TabsItemProps<T>,
) {
  const {
    outerComponent: OuterComponent = "div",
    tabRef,
    as: As = "span",
    children,
    isSelected,
    ...elementProps
  } = props;
  const { setIndicatorWidth, setIndicatorPosition } = useTabs();

  const ref = useRef<HTMLElement | null>(null);
  const { isHovered, hoverProps } = useHover({});
  const { isFocusVisible, focusProps } = useFocusRing();

  useIndicatorSizing({
    itemRef: ref,
    isSelected,
    setIndicatorPosition,
    setIndicatorWidth,
  });

  useScrollIntoViewIfNeeded({ itemRef: ref, isSelected });

  const className = classNames(
    styles.TabsItem,
    isSelected && styles.selected,
    isHovered && styles.hovered,
    isFocusVisible && styles.focusVisible,
  );

  return (
    <OuterComponent className={className}>
      <As
        ref={tabRef}
        {...mergeProps(hoverProps, focusProps, elementProps as object)}
        className={styles.tab}
      >
        <span ref={ref} className={styles.text}>
          {children}
        </span>
      </As>
    </OuterComponent>
  );
}
