import React, { ReactNode, useContext, useMemo, useRef } from "react";
import {
  AriaLinkOptions,
  mergeProps,
  useFocusRing,
  useHover,
  useLink,
} from "react-aria";
import { Icon } from "../Icon";
import { Text } from "../Text";
import { VerticalStack } from "../VerticalStack";
import { IconSymbol } from "../types";
import { classNames } from "../utilities/css";

import styles from "./ForgeLayoutNav.module.scss";
import { useForgeLayout } from "./ForgeLayout";

export type ForgeLayoutNavProps = {
  /**
   * Sidebar nav title.
   *
   * @default Main
   */
  title?: ReactNode;

  /** Selected href of sidebar nav link. */
  selectedHref?: AriaLinkOptions["href"];

  /** Multipage container children. */
  children: ReactNode;
};

export type ForgeLayoutNavSectionProps = {
  /** Sidebar nav section title. */
  title: ReactNode;

  /** Sidebar nav section children. */
  children: ReactNode;
};

export type ForgeLayoutNavLinkProps = {
  /** Nav link icon symbol. */
  iconSymbol: IconSymbol;

  /** Nav link children. */
  children: ReactNode;
} & AriaLinkOptions;

export type ForgeLayoutNavContextType = {
  selectedHref?: ForgeLayoutNavProps["selectedHref"];
};

const ForgeLayoutNavContext =
  React.createContext<ForgeLayoutNavContextType | null>(null);

export const useForgeLayoutNav = () => {
  const context = useContext(ForgeLayoutNavContext);
  if (!context) {
    throw new Error("useForgeLayoutNav must be used within a ForgeLayoutNav");
  }
  return context;
};

export function ForgeLayoutNav(props: ForgeLayoutNavProps) {
  const { navState = "expanded" } = useForgeLayout();
  const { selectedHref, title = "Main", children } = props;
  const context = useMemo(() => {
    return { selectedHref };
  }, [selectedHref]);

  if (navState === "collapsed") {
    return null;
  }

  return (
    <ForgeLayoutNavContext.Provider value={context}>
      <div className={styles.nav}>
        <VerticalStack as="nav" aria-label={title} gap="1" inlineAlign="start">
          <Logo />
          {children}
        </VerticalStack>
      </div>
    </ForgeLayoutNavContext.Provider>
  );
}

export function ForgeLayoutNavSection(props: ForgeLayoutNavSectionProps) {
  const { title, children } = props;
  return (
    <VerticalStack gap="1" inlineAlign="start">
      <Text variant="overline" color="primary.600">
        {title}
      </Text>
      {children}
    </VerticalStack>
  );
}

export function ForgeLayoutNavLink(props: ForgeLayoutNavLinkProps) {
  const { href, iconSymbol, children } = props;
  const { selectedHref } = useForgeLayoutNav();

  const ref = useRef(null);
  const { linkProps } = useLink(props, ref);
  const { focusProps, isFocusVisible } = useFocusRing(props);
  const { hoverProps, isHovered } = useHover(props);
  const isSelected = href === selectedHref;
  const className = classNames(
    styles.link,
    isFocusVisible && styles.focused,
    isHovered && styles.hovered,
    isSelected && styles.selected,
  );
  return (
    <a
      ref={ref}
      className={className}
      {...mergeProps(hoverProps, focusProps, linkProps)}
      aria-current={isSelected ? "page" : undefined}
    >
      <Icon symbol={iconSymbol} />
      <Text variant="subtitle2">{children}</Text>
    </a>
  );
}

function Logo() {
  return (
    <svg
      width="120"
      height="36"
      viewBox="0 0 120 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M101.442 9.95833H104.164V7.80189H101.442C101.261 7.80189 101.169 7.70856 101.169 7.54911V5.41406H98.7428V14.592C98.7428 17.0013 99.7867 18.3332 102.509 18.3332H104.164V16.1749H102.871C101.442 16.1749 101.169 15.5332 101.169 14.2479V10.2325C101.171 10.0497 101.261 9.95833 101.442 9.95833ZM95.138 12.1148L94.2305 11.6559C93.2327 11.1503 92.9828 10.9442 92.9828 10.4853C92.9828 9.98166 93.3673 9.65888 94.071 9.65888C94.6843 9.65888 95.4091 9.88833 96.2492 10.3706L97.1797 8.49024C96.0454 7.73189 94.9111 7.52577 93.9575 7.52577C91.8927 7.52577 90.5777 8.83442 90.5777 10.5553C90.5777 12.0234 91.3044 12.9412 93.1866 13.8356L94.0479 14.2479C94.9554 14.6834 95.2283 15.0062 95.2283 15.4185C95.2283 16.0387 94.6381 16.3363 93.7076 16.3363C92.8694 16.3363 92.0523 16.0835 91.191 15.5565L90.2374 17.5302C91.4178 18.2866 92.7329 18.5394 93.821 18.5394C96.0896 18.5394 97.6777 17.4154 97.6777 15.3037C97.6777 13.9037 96.9529 13.0326 95.138 12.1148ZM84.339 7.52577C81.1187 7.52577 78.8943 9.7736 78.8943 13.0326C78.8943 16.2896 81.1187 18.5394 84.339 18.5394C87.5612 18.5394 89.7837 16.2896 89.7837 13.0326C89.7817 9.7736 87.5593 7.52577 84.339 7.52577ZM84.339 16.3363C82.5472 16.3363 81.3667 15.0276 81.3667 13.0326C81.3667 11.0356 82.5472 9.72888 84.339 9.72888C86.1308 9.72888 87.3112 11.0356 87.3112 13.0326C87.3093 15.0276 86.1289 16.3363 84.339 16.3363ZM72.4518 7.52577C69.2757 7.52577 67.1898 9.59082 67.1898 13.1473V23.1283H69.616V17.5982C69.616 17.4602 69.6853 17.3921 69.7756 17.3921C69.8429 17.3921 69.889 17.4154 69.9794 17.5068C70.5696 18.0805 71.6117 18.5394 72.7017 18.5394C75.7644 18.5394 77.9869 16.2896 77.9869 13.0326C77.9849 9.7736 75.7625 7.52577 72.4518 7.52577ZM72.5402 16.3363C70.7484 16.3363 69.568 15.0276 69.568 13.0326C69.568 11.0356 70.7484 9.72888 72.5402 9.72888C74.3321 9.72888 75.5125 11.0356 75.5125 13.0326C75.5125 15.0276 74.3321 16.3363 72.5402 16.3363ZM54.0549 12.1148L53.1474 11.6559C52.1477 11.1503 51.8997 10.9442 51.8997 10.4853C51.8997 9.98166 52.2842 9.65888 52.9878 9.65888C53.6011 9.65888 54.3259 9.88833 55.1661 10.3706L56.0966 8.49024C54.9623 7.73189 53.828 7.52577 52.8744 7.52577C50.8096 7.52577 49.4946 8.83442 49.4946 10.5553C49.4946 12.0234 50.2194 12.9412 52.1035 13.8356L52.9648 14.2479C53.8722 14.6834 54.1452 15.0062 54.1452 15.4185C54.1452 16.0387 53.555 16.3363 52.6245 16.3363C51.7862 16.3363 50.9692 16.0835 50.1059 15.5565L49.1543 17.5302C50.3328 18.2866 51.6497 18.5394 52.7379 18.5394C55.0065 18.5394 56.5946 17.4154 56.5946 15.3037C56.5926 13.9037 55.8698 13.0326 54.0549 12.1148ZM45.7052 7.80189V8.46691C45.7052 8.60497 45.6379 8.67303 45.5475 8.67303C45.4783 8.67303 45.4341 8.64969 45.3438 8.5583C44.7535 7.98468 43.7096 7.52577 42.6214 7.52577C39.5588 7.52577 37.3344 9.7736 37.3344 13.0326C37.3344 16.2896 39.5588 18.5394 42.6214 18.5394C43.7096 18.5394 44.7535 18.0805 45.3438 17.5068C45.4341 17.4154 45.4783 17.3921 45.5475 17.3921C45.6379 17.3921 45.7052 17.4602 45.7052 17.5982V18.2632H48.1334V7.80189H45.7052ZM42.7791 16.3363C40.9872 16.3363 39.8068 15.0276 39.8068 13.0326C39.8068 11.0356 40.9872 9.72888 42.7791 9.72888C44.5709 9.72888 45.7513 11.0356 45.7513 13.0326C45.7513 15.0276 44.569 16.3363 42.7791 16.3363ZM28.4426 13.9037H36.3366C36.3827 13.6509 36.4269 13.4001 36.4269 12.9645C36.4269 9.8436 34.3852 7.52577 31.2091 7.52577C28.1465 7.52577 25.7202 9.7736 25.7202 13.0559C25.7202 16.2896 27.9196 18.5394 31.1649 18.5394C33.1163 18.5394 34.7485 17.7363 35.9501 16.0154L34.2275 14.6154C33.2509 15.924 32.2761 16.3363 31.2322 16.3363C29.2366 16.3363 28.3291 14.9148 28.2157 14.2032C28.1676 13.9737 28.2388 13.9037 28.4426 13.9037ZM28.3291 11.6092C28.6694 10.462 29.8268 9.65888 31.1188 9.65888C32.3896 9.65888 33.5239 10.462 33.8642 11.6092C33.9315 11.8386 33.9084 12 33.7046 12H28.4868C28.2811 12 28.258 11.8386 28.3291 11.6092Z"
        fill="#0B2780"
      />
      <path
        d="M67.2155 7.78125L63.5979 17.357C62.5509 20.1562 61.5713 21.4074 58.1581 23.021L57.1361 20.9736C59.0645 19.9711 60.0402 19.2559 60.6206 18.2264L56.521 7.78125H59.1377L61.7313 14.8102C61.7988 14.9683 61.8682 15.0146 61.9589 15.0146C62.0495 15.0146 62.1401 14.9683 62.1864 14.8102L64.6431 7.78125H67.2155Z"
        fill="#0B2780"
      />
      <path
        d="M10.8781 14.2855C10.6921 14.2855 10.5517 14.2624 10.3894 14.1717L5.43906 11.3744V13.8305L10.3894 16.6298C10.5517 16.7204 10.6921 16.7435 10.8781 16.7435C11.0424 16.7435 11.2283 16.6972 11.3688 16.6298L21.7582 10.7594V13.2175L11.3688 19.0627C11.2283 19.1533 11.0661 19.1996 10.8781 19.1996C10.7159 19.1996 10.5517 19.1533 10.3894 19.0627L5.43906 16.2885V18.7215L10.3894 21.5208C10.5517 21.6114 10.7159 21.6345 10.8781 21.6345C11.0661 21.6345 11.2521 21.5882 11.3688 21.5208L21.7582 15.6735V17.2197C21.7582 17.7672 21.4555 18.2897 20.9648 18.5634L11.6715 23.7956C11.44 23.9306 11.1591 24 10.8781 24C10.5992 24 10.3419 23.9306 10.0847 23.7956L0.793405 18.5634C0.302722 18.2897 0 17.7672 0 17.2197V6.77837C0 6.20965 0.302722 5.6872 0.793405 5.41345L10.0847 0.204353C10.3419 0.0694027 10.5992 0 10.8781 0C11.1591 0 11.44 0.0694027 11.6715 0.204353L20.9648 5.41345C21.4555 5.6872 21.7582 6.20965 21.7582 6.77837V8.32645L11.3688 14.1717C11.2283 14.2411 11.0424 14.2855 10.8781 14.2855Z"
        fill="#0B2780"
      />
      <path
        d="M47.6641 25.02V26.15H44.7541V27.94H46.9841V29.05H44.7541V32H43.3541V25.02H47.6641ZM52.6168 32.09C52.0835 32.09 51.6035 31.9733 51.1768 31.74C50.7501 31.5 50.4135 31.1633 50.1668 30.73C49.9268 30.2967 49.8068 29.7967 49.8068 29.23C49.8068 28.6633 49.9301 28.1633 50.1768 27.73C50.4301 27.2967 50.7735 26.9633 51.2068 26.73C51.6401 26.49 52.1235 26.37 52.6568 26.37C53.1901 26.37 53.6735 26.49 54.1068 26.73C54.5401 26.9633 54.8801 27.2967 55.1268 27.73C55.3801 28.1633 55.5068 28.6633 55.5068 29.23C55.5068 29.7967 55.3768 30.2967 55.1168 30.73C54.8635 31.1633 54.5168 31.5 54.0768 31.74C53.6435 31.9733 53.1568 32.09 52.6168 32.09ZM52.6168 30.87C52.8701 30.87 53.1068 30.81 53.3268 30.69C53.5535 30.5633 53.7335 30.3767 53.8668 30.13C54.0001 29.8833 54.0668 29.5833 54.0668 29.23C54.0668 28.7033 53.9268 28.3 53.6468 28.02C53.3735 27.7333 53.0368 27.59 52.6368 27.59C52.2368 27.59 51.9001 27.7333 51.6268 28.02C51.3601 28.3 51.2268 28.7033 51.2268 29.23C51.2268 29.7567 51.3568 30.1633 51.6168 30.45C51.8835 30.73 52.2168 30.87 52.6168 30.87ZM59.4338 27.32C59.6138 27.0267 59.8471 26.7967 60.1338 26.63C60.4271 26.4633 60.7604 26.38 61.1338 26.38V27.85H60.7638C60.3238 27.85 59.9904 27.9533 59.7638 28.16C59.5438 28.3667 59.4338 28.7267 59.4338 29.24V32H58.0338V26.46H59.4338V27.32ZM65.7467 26.37C66.1601 26.37 66.5234 26.4533 66.8367 26.62C67.1501 26.78 67.3967 26.99 67.5767 27.25V26.46H68.9867V32.04C68.9867 32.5533 68.8834 33.01 68.6767 33.41C68.4701 33.8167 68.1601 34.1367 67.7467 34.37C67.3334 34.61 66.8334 34.73 66.2467 34.73C65.4601 34.73 64.8134 34.5467 64.3067 34.18C63.8067 33.8133 63.5234 33.3133 63.4567 32.68H64.8467C64.9201 32.9333 65.0767 33.1333 65.3167 33.28C65.5634 33.4333 65.8601 33.51 66.2067 33.51C66.6134 33.51 66.9434 33.3867 67.1967 33.14C67.4501 32.9 67.5767 32.5333 67.5767 32.04V31.18C67.3967 31.44 67.1467 31.6567 66.8267 31.83C66.5134 32.0033 66.1534 32.09 65.7467 32.09C65.2801 32.09 64.8534 31.97 64.4667 31.73C64.0801 31.49 63.7734 31.1533 63.5467 30.72C63.3267 30.28 63.2167 29.7767 63.2167 29.21C63.2167 28.65 63.3267 28.1533 63.5467 27.72C63.7734 27.2867 64.0767 26.9533 64.4567 26.72C64.8434 26.4867 65.2734 26.37 65.7467 26.37ZM67.5767 29.23C67.5767 28.89 67.5101 28.6 67.3767 28.36C67.2434 28.1133 67.0634 27.9267 66.8367 27.8C66.6101 27.6667 66.3667 27.6 66.1067 27.6C65.8467 27.6 65.6067 27.6633 65.3867 27.79C65.1667 27.9167 64.9867 28.1033 64.8467 28.35C64.7134 28.59 64.6467 28.8767 64.6467 29.21C64.6467 29.5433 64.7134 29.8367 64.8467 30.09C64.9867 30.3367 65.1667 30.5267 65.3867 30.66C65.6134 30.7933 65.8534 30.86 66.1067 30.86C66.3667 30.86 66.6101 30.7967 66.8367 30.67C67.0634 30.5367 67.2434 30.35 67.3767 30.11C67.5101 29.8633 67.5767 29.57 67.5767 29.23ZM77.0041 29.11C77.0041 29.31 76.9907 29.49 76.9641 29.65H72.9141C72.9474 30.05 73.0874 30.3633 73.3341 30.59C73.5807 30.8167 73.8841 30.93 74.2441 30.93C74.7641 30.93 75.1341 30.7067 75.3541 30.26H76.8641C76.7041 30.7933 76.3974 31.2333 75.9441 31.58C75.4907 31.92 74.9341 32.09 74.2741 32.09C73.7407 32.09 73.2607 31.9733 72.8341 31.74C72.4141 31.5 72.0841 31.1633 71.8441 30.73C71.6107 30.2967 71.4941 29.7967 71.4941 29.23C71.4941 28.6567 71.6107 28.1533 71.8441 27.72C72.0774 27.2867 72.4041 26.9533 72.8241 26.72C73.2441 26.4867 73.7274 26.37 74.2741 26.37C74.8007 26.37 75.2707 26.4833 75.6841 26.71C76.1041 26.9367 76.4274 27.26 76.6541 27.68C76.8874 28.0933 77.0041 28.57 77.0041 29.11ZM75.5541 28.71C75.5474 28.35 75.4174 28.0633 75.1641 27.85C74.9107 27.63 74.6007 27.52 74.2341 27.52C73.8874 27.52 73.5941 27.6267 73.3541 27.84C73.1207 28.0467 72.9774 28.3367 72.9241 28.71H75.5541Z"
        fill="#0B2780"
      />
    </svg>
  );
}
