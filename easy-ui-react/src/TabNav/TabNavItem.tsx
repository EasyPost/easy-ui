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
  const { setIndicatorWidth, setIndicatorPosition } = useTabNav();

  const ref = useRef<HTMLLIElement | null>(null);
  const { isHovered, hoverProps } = useHover({});

  const className = classNames(
    styles.TabNavItem,
    isCurrentPage && styles.currentPage,
    isHovered && styles.hovered,
  );

  useEffect(() => {
    if (isCurrentPage && ref.current) {
      const $item = ref.current;
      const $nav = $item.closest("nav");

      if (!$nav) {
        throw new Error("Unable to find parent nav element from tab item");
      }

      const itemRect = $item.getBoundingClientRect();
      const navRect = $nav.getBoundingClientRect();
      const position = itemRect.x - navRect.x;

      setIndicatorWidth(itemRect.width);
      setIndicatorPosition(position);
    }
  }, [setIndicatorWidth, setIndicatorPosition, isCurrentPage]);

  return (
    <li className={className}>
      <As
        {...hoverProps}
        className={styles.link}
        aria-current={isCurrentPage ? "page" : undefined}
        {...restProps}
      >
        <span ref={ref} className={styles.text}>
          {children}
        </span>
      </As>
    </li>
  );
}
