import React, { ReactNode, useEffect, useState } from "react";
import { productLayoutMediaQuery } from "./constants";

import styles from "./ScreenSizeSwitcher.module.scss";

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
 * to resolve on the client. And until the client resolves, media queries
 * through CSS are used to remove the appropriate tree from the user
 * agent (using display: none).
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

  return (
    <>
      {(isLargeScreen === null || isLargeScreen === true) && (
        <div className={styles.largeScreen}>{renderOnLargeScreen()}</div>
      )}
      {(isLargeScreen === null || isLargeScreen === false) && (
        <div className={styles.smallScreen}>{renderOnSmallScreen()}</div>
      )}
    </>
  );
}
