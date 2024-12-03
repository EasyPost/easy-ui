import React from "react";
import MoreVertIcon from "@easypost/easy-ui-icons/MoreVert";
import { AriaButtonProps } from "react-aria";
import { UnstyledPressButton } from "../UnstyledButton/UnstyledPressButton";
import { Text } from "../Text";
import { Icon } from "../Icon";
import styles from "./KebabButton.module.scss";

export type KebabButtonProps = AriaButtonProps & {
  /** Optional custom accessibility label describing the action. */
  accessibilityLabel?: string;
};

/**
 * Typically used as a trigger to display a set of options
 * for the user to choose from.
 *
 * @remarks
 * Can be used alongside Easy UI's `<Menu />` as the trigger
 * element.
 */
export const KebabButton = React.forwardRef<null, KebabButtonProps>(
  (props, inRef) => {
    const { accessibilityLabel = "Actions", ...restProps } = props;

    return (
      <UnstyledPressButton
        ref={inRef}
        className={styles.KebabButton}
        {...restProps}
      >
        <Text visuallyHidden>{accessibilityLabel}</Text>
        <Icon symbol={MoreVertIcon} />
      </UnstyledPressButton>
    );
  },
);

KebabButton.displayName = "KebabButton";
