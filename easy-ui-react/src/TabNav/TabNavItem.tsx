import React, {
  ComponentProps,
  ElementType,
  ReactNode,
  useEffect,
  useRef,
} from "react";
import { useHover } from "react-aria";
import { classNames } from "../utilities/css";
import { useTabNav } from "./context";

import styles from "./TabNavItem.module.scss";

type TabNavItemProps<T extends ElementType = "a"> = ComponentProps<T> & {
  as?: T;
  children: ReactNode;
  isCurrentPage?: boolean;
};

export function TabNavItem<T extends ElementType = "a">(
  props: TabNavItemProps<T>,
) {
  const { as: As = "a", children, isCurrentPage, ...restProps } = props;
  const { setWidth, setLeft } = useTabNav();

  const ref = useRef<HTMLLIElement | null>(null);
  const { isHovered, hoverProps } = useHover({});

  const className = classNames(
    styles.TabNavItem,
    isCurrentPage && styles.selected,
    isHovered && styles.hovered,
  );

  useEffect(() => {
    if (isCurrentPage && ref.current && ref.current.parentElement) {
      const parentRect = ref.current.parentElement.getBoundingClientRect();
      const rect = ref.current.getBoundingClientRect();
      setWidth(rect.width);
      setLeft(rect.x - parentRect.x);
    }
  }, [setWidth, setLeft, isCurrentPage]);

  return (
    <li ref={ref}>
      <As
        {...hoverProps}
        className={className}
        aria-current={isCurrentPage ? "page" : undefined}
        {...restProps}
      >
        {children}
      </As>
    </li>
  );
}
