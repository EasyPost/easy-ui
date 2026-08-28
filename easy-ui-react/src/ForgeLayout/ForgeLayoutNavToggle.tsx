import LeftPanelCloseIcon from "@easypost/easy-ui-icons/LeftPanelClose";
import LeftPanelOpenIcon from "@easypost/easy-ui-icons/LeftPanelOpen";
import React, { useCallback } from "react";
import { mergeProps, useFocusRing, useHover } from "react-aria";
import { Icon } from "../Icon";
import { Text } from "../Text";
import { UnstyledButton } from "../UnstyledButton";
import type { UnstyledButtonProps } from "../UnstyledButton";
import { classNames } from "../utilities/css";
import { useForgeLayout } from "./ForgeLayout";

import styles from "./ForgeLayoutNavToggle.module.scss";

const COLLAPSE_LABEL = "Collapse navigation";
const EXPAND_LABEL = "Expand navigation";

export type ForgeLayoutNavToggleProps = Omit<
  UnstyledButtonProps,
  "children" | "href" | "className"
> & {
  /**
   * Custom accessibility label describing the toggle. Defaults to
   * "Collapse navigation" or "Expand navigation" depending on the nav state.
   */
  accessibilityLabel?: string;
};

/**
 * Toggles a `<ForgeLayout />` nav between its `expanded` and `rail` states.
 *
 * @remarks
 * This is a standalone primitive rather than something the layout renders on
 * its own, so it can be placed wherever a product needs it—typically at the
 * start of a `ForgeLayout.Controls`. It renders nothing when the nav is
 * `collapsed`, since there is no nav to toggle.
 *
 * Nav state changes are reported through `ForgeLayout`'s `onNavStateChange`.
 * Persisting the state across sessions is left to the consuming application.
 *
 * @example
 * ```tsx
 * <ForgeLayout.Controls visibleWhenNavStateIs="expanded">
 *   <ForgeLayout.NavToggle />
 *   <ForgeLayout.ModeSwitcher onModeChange={() => {}} />
 * </ForgeLayout.Controls>
 * ```
 */
export function ForgeLayoutNavToggle(props: ForgeLayoutNavToggleProps) {
  const { accessibilityLabel, ...buttonProps } = props;
  const { navState, setNavState, navId } = useForgeLayout();
  const { focusProps, isFocusVisible } = useFocusRing(props);
  const { hoverProps, isHovered } = useHover(props);
  const isExpanded = navState === "expanded";

  const handlePress = useCallback(() => {
    setNavState(isExpanded ? "rail" : "expanded");
  }, [isExpanded, setNavState]);

  // There is no nav to toggle when it has been removed from the layout.
  if (navState === "collapsed") {
    return null;
  }

  const label =
    accessibilityLabel ?? (isExpanded ? COLLAPSE_LABEL : EXPAND_LABEL);
  const className = classNames(
    styles.toggle,
    isFocusVisible && styles.focused,
    isHovered && styles.hovered,
  );

  return (
    <UnstyledButton
      // `mergeProps` chains handlers, so a supplied `onPress` runs alongside
      // the state change rather than replacing it.
      {...mergeProps(buttonProps, hoverProps, focusProps, {
        onPress: handlePress,
      })}
      className={className}
      aria-expanded={isExpanded}
      aria-controls={navId}
    >
      <Text visuallyHidden>{label}</Text>
      <Icon symbol={isExpanded ? LeftPanelCloseIcon : LeftPanelOpenIcon} />
    </UnstyledButton>
  );
}
