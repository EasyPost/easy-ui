import { AriaLabelingProps } from "@react-types/shared";
import React, {
  ComponentProps,
  ElementType,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useHover } from "react-aria";
import { Text } from "../Text";
import { classNames, getComponentToken } from "../utilities/css";

import styles from "./TabNav.module.scss";

type TabNavProps = AriaLabelingProps & {
  children: ReactNode;
};

type TabNavLinkProps<T extends ElementType = "a"> = ComponentProps<T> & {
  "aria-current"?:
    | "page"
    | "step"
    | "location"
    | "date"
    | "time"
    | true
    | false;
  as?: T;
  children: ReactNode;
};

const TabNavContext = createContext<{
  setLeft: React.Dispatch<React.SetStateAction<number | null>>;
  setWidth: React.Dispatch<React.SetStateAction<number | null>>;
} | null>(null);

const useTabNav = () => {
  const tabNavContext = useContext(TabNavContext);
  if (!tabNavContext) {
    throw new Error("useTabNav must be used within a TabNav");
  }
  return tabNavContext;
};

export function TabNav(props: TabNavProps) {
  const { children, ...labelingProps } = props;
  const [width, setWidth] = useState<number | null>(null);
  const [left, setLeft] = useState<number | null>(null);
  const context = useMemo(() => {
    return { setWidth, setLeft };
  }, []);
  const style = {
    ...getComponentToken("tab-nav", "selected-tab-width", `${width}px`),
    ...getComponentToken("tab-nav", "selected-tab-left", `${left}px`),
  };
  return (
    <TabNavContext.Provider value={context}>
      <nav {...labelingProps} className={styles.TabNav} style={style}>
        <ul role="list" className={styles.list}>
          {children}
          <div className={styles.line} />
        </ul>
      </nav>
    </TabNavContext.Provider>
  );
}

function TabNavLink<T extends ElementType = "a">(props: TabNavLinkProps<T>) {
  const { setWidth, setLeft } = useTabNav();
  const {
    as: As = "a",
    children,
    ["aria-current"]: ariaCurrent,
    ...restProps
  } = props;
  const ref = useRef<HTMLLIElement | null>(null);
  const { isHovered, hoverProps } = useHover({});
  const className = classNames(
    styles.TabNavLink,
    ariaCurrent && styles.selected,
    isHovered && styles.hovered,
  );
  useEffect(() => {
    if (ariaCurrent && ref.current && ref.current.parentElement) {
      const parentRect = ref.current.parentElement.getBoundingClientRect();
      const rect = ref.current.getBoundingClientRect();
      setWidth(rect.width);
      setLeft(rect.x - parentRect.x);
    }
  }, [setWidth, setLeft, ariaCurrent]);
  return (
    <li ref={ref}>
      <As
        {...hoverProps}
        className={className}
        aria-current={ariaCurrent}
        {...restProps}
      >
        <Text variant="subtitle1">{children}</Text>
      </As>
    </li>
  );
}

TabNav.Link = TabNavLink;
