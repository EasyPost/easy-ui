import React from "react";
import MoreVertIcon from "@easypost/easy-ui-icons/MoreVert";
import { AriaButtonProps } from "react-aria";
import { UnstyledPressButton } from "../DataGrid/UnstyledPressButton";
import { Text } from "../Text";
import { Icon } from "../Icon";
import styles from "./KebabButton.module.scss";

type KebabButtonProps = AriaButtonProps & {
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

    const isExpanded = props["aria-expanded"];
    return (
      <UnstyledPressButton
        ref={inRef}
        className={styles.kebabButton}
        {...restProps}
      >
        <Text visuallyHidden>{accessibilityLabel}</Text>
        <Icon
          symbol={MoreVertIcon}
          color={isExpanded ? "neutral.000" : "neutral.800"}
        />
      </UnstyledPressButton>
    );
  },
);

KebabButton.displayName = "KebabButton";
