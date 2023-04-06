import React from "react";
import {
  IconSymbol,
  ThemeTokenNamespace,
  DesignTokenNamespace,
} from "../types";
import {
  getResponsiveDesignToken,
  getComponentThemeToken,
  ResponsiveProp,
} from "../utilities/css";

import styles from "./Icon.module.scss";

export type IconSize = DesignTokenNamespace<"size.icon">;
export type IconColor = ThemeTokenNamespace<"color.text">;

export type IconProps = {
  /** Icon symbol SVG source from @easypost/easy-ui-icons */
  symbol: IconSymbol;
  /** Size of the icon */
  size?: ResponsiveProp<IconSize>;
  /** Color of the icon */
  color?: IconColor;
  /** Description of icon for informative symbols */
  accessibilityLabel?: string;
};

export function Icon({
  symbol: Symbol,
  size = "md",
  color,
  accessibilityLabel,
}: IconProps) {
  const style = {
    ...getComponentThemeToken("icon", "color", "color.text", color),
    ...getResponsiveDesignToken("icon", "size", "size.icon", size),
  } as React.CSSProperties;
  return (
    <span className={styles.Icon} style={style}>
      <Symbol
        className={styles.Svg}
        focusable="false"
        role="img"
        title={accessibilityLabel}
        aria-hidden={!accessibilityLabel ? "true" : undefined}
      />
    </span>
  );
}
