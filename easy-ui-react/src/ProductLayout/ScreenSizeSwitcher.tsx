import React, { ReactNode, useEffect, useState } from "react";
import tokens from "@easypost/easy-ui-tokens/js/tokens";

import styles from "./ScreenSizeSwitcher.module.scss";

export const productLayoutMediaQuery = `(min-width: ${tokens["breakpoint.lg"]})`;

export type ScreenSizeSwitcherProps = {
  onChange?: (isDesktop: boolean) => void;
  renderOnLargeScreen: () => ReactNode;
  renderOnSmallScreen: () => ReactNode;
};

/**
 * SSR-compatible way to render different component trees whether the product
 * layout is on a small screen or large screen.
 *
 * It does this by rendering both component trees until the media query is able
 * to resolve on the client. And until the client resolves, CSS is used to
 * remove the appropriate tree from the user agent (using display: none).
 *
 * @private
 * @ignore
 */
export function ScreenSizeSwitcher(props: ScreenSizeSwitcherProps) {
  const {
    onChange = () => {},
    renderOnLargeScreen,
    renderOnSmallScreen,
  } = props;

  const [isLargeScreen, setIsLargeScreen] = useState<boolean | null>(null);

  useEffect(() => {
    const mediaQueries = window.matchMedia(productLayoutMediaQuery);
    setIsLargeScreen(mediaQueries.matches);

    const handleChange = (mediaQueryList: MediaQueryListEvent) => {
      setIsLargeScreen(mediaQueryList.matches);
      onChange(mediaQueryList.matches);
    };

    mediaQueries.addEventListener("change", handleChange);
    return () => {
      mediaQueries.removeEventListener("change", handleChange);
    };
  }, [onChange]);

  const isSmallScreenShowing =
    isLargeScreen === null || isLargeScreen === false;
  const isLargeScreenShowing = isLargeScreen === null || isLargeScreen === true;

  return (
    <>
      {isLargeScreenShowing && (
        <div className={styles.largeScreen}>{renderOnLargeScreen()}</div>
      )}
      {isSmallScreenShowing && (
        <div className={styles.smallScreen}>{renderOnSmallScreen()}</div>
      )}
    </>
  );
}
