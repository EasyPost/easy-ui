import React, { ReactNode, useEffect } from "react";
import { productLayoutMediaQuery } from "./constants";

import styles from "./ScreenSizeSwitcher.module.scss";

export type ScreenSizeSwitcherProps = {
  onChange?: (isDesktop: boolean) => void;
  renderOnLargeScreen: () => ReactNode;
  renderOnSmallScreen: () => ReactNode;
};

/**
 * SSR-compatible way to render different component trees whether the product
 * layout is on a small screen or a large screen.
 *
 * It does this by rendering both component trees and using media queries
 * through CSS to remove the applicable tree from the user agent (using
 * display: none).
 *
 * Provides a change listener for adjusting component state as needed.
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

  useEffect(() => {
    const mediaQueries = window.matchMedia(productLayoutMediaQuery);
    const handleChange = (mediaQueryList: MediaQueryListEvent) => {
      onChange(mediaQueryList.matches);
    };
    mediaQueries.addEventListener("change", handleChange);
    return () => {
      mediaQueries.removeEventListener("change", handleChange);
    };
  }, [onChange]);

  return (
    <>
      <div className={styles.largeScreen}>{renderOnLargeScreen()}</div>
      <div className={styles.smallScreen}>{renderOnSmallScreen()}</div>
    </>
  );
}
