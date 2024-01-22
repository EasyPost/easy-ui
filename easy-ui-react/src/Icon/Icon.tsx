import React from "react";
import { DesignTokenNamespace, IconSymbol, ThemeColorAliases } from "../types";
import {
  ResponsiveProp,
  backwardsCompatibleColorToken,
  getComponentThemeToken,
  getResponsiveDesignToken,
} from "../utilities/css";

import styles from "./Icon.module.scss";

export type IconSize = DesignTokenNamespace<"size.icon">;
export type IconColor =
  | ThemeColorAliases
  | "action"
  | "code.selector"
  | "danger"
  | "disabled"
  | "gray.resting"
  | "inverse"
  | "primary"
  | "primary-inverse";

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

/**
 * Icons are helpful and familiar visual symbols used to communicate
 * ideas and represent objects and actions.
 *
 * @remarks
 * Can accept any Easy UI icon via `symbol` prop. Supports customizable
 * responsive sizing, theme and design token colors, and an accessibility
 * label for informative symbols.
 *
 * @example
 * _Default:_
 * ```tsx
 * import { Icon } from "@easypost/easy-ui/Icon";
 * import AddIcon from "@easypost/easy-ui-icons/Add";
 *
 * export function Component() {
 *  return <Icon symbol={AddIcon} />;
 * }
 * ```
 *
 * @example
 * _With accessibility label:_
 * ```tsx
 * import { Icon } from "@easypost/easy-ui/Icon";
 * import AddIcon from "@easypost/easy-ui-icons/Add";
 *
 * export function Component() {
 *  return <Icon symbol={AddIcon} accessibilityLabel="Add item" />;
 * }
 * ```
 * @example
 * _With color and size:_
 * ```tsx
 * import { Icon } from "@easypost/easy-ui/Icon";
 * import AddIcon from "@easypost/easy-ui-icons/Add";
 *
 * export function Component() {
 *  return <Icon symbol={AddIcon} color="positive.600" size="sm" />;
 * }
 * ```
 * @example
 * _With responsive sizing:_
 * ```tsx
 * import { Icon } from "@easypost/easy-ui/Icon";
 * import AddIcon from "@easypost/easy-ui-icons/Add";
 *
 * export function Component() {
 *  return <Icon symbol={AddIcon} size={{ sm: "sm", md: "md", lg: "lg" }} />;
 * }
 * ```
 */
export function Icon({
  symbol: Symbol,
  size = "md",
  color,
  accessibilityLabel,
}: IconProps) {
  const style = {
    ...getComponentThemeToken(
      "icon",
      "color",
      "color",
      backwardsCompatibleColorToken(color),
    ),
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
