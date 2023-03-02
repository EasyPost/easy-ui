import React from "react";
import { IconSymbol, TokenNamespace } from "../types";
import {
  getComponentToken,
  getResponsiveToken,
  ResponsiveProp,
} from "../utilities/css";

import styles from "./Icon.module.scss";

export type IconSize = TokenNamespace<"size-icon">;
export type IconColor = TokenNamespace<"color">;

export type IconProps = {
  /** Icon symbol SVG source from @easypost/easy-ui-icons */
  symbol: IconSymbol;
  /** Size of the icon. */
  size?: ResponsiveProp<IconSize>;
  /** Color of the icon. */
  color?: IconColor;
  /** Description of icon for non-decorative symbols. */
  accessibilityLabel?: string;
};

export function Icon({
  symbol: Symbol,
  size = "md",
  color,
  accessibilityLabel,
}: IconProps) {
  const style = {
    ...getComponentToken("icon", "color", "color", color),
    ...getResponsiveToken("icon", "size", "size-icon", size),
  } as React.CSSProperties;
  return (
    <span className={styles.Icon} style={style}>
      <Symbol
        className={styles.Svg}
        focusable="false"
        aria-hidden={!accessibilityLabel ? "true" : undefined}
        role={accessibilityLabel ? "img" : "presentation"}
        title={accessibilityLabel}
      />
    </span>
  );
}
