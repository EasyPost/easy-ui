import React from "react";
import MoreVertIcon from "@easypost/easy-ui-icons/MoreVert";
import { AriaButtonProps } from "react-aria";
import { IconButton } from "../IconButton";
import { RouterLinkProps } from "../utilities/router";

export type KebabButtonProps = AriaButtonProps &
  RouterLinkProps & {
    /** Optional custom accessibility label describing the action. */
    accessibilityLabel?: string;
  };

/**
 * Typically used as a trigger to display a set of options
 * for the user to choose from.
 *
 * @remarks
 * Can be used alongside Easy UI's `<Menu />` as the trigger
 * element. Renders a ghost `<IconButton />` at `xs` with a vertical
 * ellipsis, so it holds a solid fill while its menu is open.
 */
export const KebabButton = React.forwardRef<null, KebabButtonProps>(
  (props, inRef) => {
    const { accessibilityLabel = "Actions", ...restProps } = props;

    return (
      <IconButton
        ref={inRef}
        variant="ghost"
        color="support"
        size="xs"
        icon={MoreVertIcon}
        accessibilityLabel={accessibilityLabel}
        {...restProps}
      />
    );
  },
);

KebabButton.displayName = "KebabButton";
