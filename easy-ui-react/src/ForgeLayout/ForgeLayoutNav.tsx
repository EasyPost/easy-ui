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
    <svg width="95" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_1141_3360)">
        <path
          d="M21.036 17.22v-1.548l-10.037 5.851a.919.919 0 0 1-.927 0l-4.786-2.79v-2.448l4.786 2.79c.287.167.64.167.927 0l10.037-5.85v-2.448l-10.037 5.85a.919.919 0 0 1-.927 0l-4.786-2.79V11.39l4.786 2.79c.287.167.64.167.927 0l10.037-5.851V6.78a1.56 1.56 0 0 0-.772-1.35L11.308.209a1.528 1.528 0 0 0-1.543 0L.808 5.43a1.56 1.56 0 0 0-.772 1.35v10.44c0 .557.294 1.072.772 1.35l8.956 5.22a1.528 1.528 0 0 0 1.543 0l8.956-5.22a1.56 1.56 0 0 0 .772-1.35h.001z"
          fill="url(#paint0_linear_1141_3360)"
        />
        <path
          d="M33.126 8.058v2.762h3.907v1.788h-3.907v4.725H31V6.16h6.868v1.9h-4.742zm20.575 3.689c0 3.384-2.678 5.746-5.703 5.746-3.024 0-5.702-2.362-5.702-5.746C42.296 8.363 44.974 6 47.998 6c3.025 0 5.703 2.363 5.703 5.747zm-2.158 0c0-2.203-1.622-3.784-3.545-3.784-1.922 0-3.56 1.58-3.56 3.784 0 2.204 1.622 3.784 3.56 3.784 1.939 0 3.545-1.58 3.545-3.784zm13.642 5.586l-2.457-3.8h-1.827v3.8h-2.064V6.16h3.797c2.473 0 4.033 1.532 4.033 3.752 0 1.548-.757 2.698-2.048 3.257l2.757 4.167h-2.19l-.001-.002zm-4.286-5.604h1.622c1.245 0 2.08-.543 2.08-1.82 0-1.276-.835-1.82-2.08-1.82H60.9v3.64zm16.134 5.764c-3.089 0-5.702-2.362-5.702-5.746C71.33 8.363 74.008 6 77.033 6c1.434 0 2.725.48 3.685 1.324l-1.244 1.437c-.63-.48-1.465-.798-2.316-.798-2.064 0-3.687 1.58-3.687 3.784 0 2.204 1.544 3.784 3.592 3.784 1.528 0 2.71-.67 3.008-2.427h-2.756v-1.74h4.648c.457 3.816-1.986 6.13-4.932 6.13h.002zM94 15.402v1.932h-6.868V6.16h6.727v1.931h-4.664v2.682h3.545v1.883h-3.545v2.746H94z"
          fill="#061340"
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_1141_3360"
          x1="2.381"
          y1="20.234"
          x2="18.847"
          y2="3.923"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#BC4543" />
          <stop offset=".5" stopColor="#F95C59" />
          <stop offset=".59" stopColor="#F86059" />
          <stop offset=".68" stopColor="#F86C59" />
          <stop offset=".78" stopColor="#F7815A" />
          <stop offset=".87" stopColor="#F69E5B" />
          <stop offset=".97" stopColor="#F4C35D" />
          <stop offset="1" stopColor="#F4D35E" />
        </linearGradient>
        <clipPath id="clip0_1141_3360">
          <path fill="#fff" d="M0 0H95V24H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}
