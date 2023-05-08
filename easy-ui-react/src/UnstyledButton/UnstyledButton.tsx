import { mergeRefs } from "@react-aria/utils";
import React, { forwardRef, useRef } from "react";
import { AriaButtonProps, mergeProps, useButton } from "react-aria";
import { classNames } from "../utilities/css";
import { omitReactAriaSpecificProps } from "../Button/utilities";

export type UnstyledButtonProps = AriaButtonProps<"button"> & {
  /* Classname to apply styles to button */
  className?: string;
  /** Link's destination */
  href?: string;
};

/**
 * An internal button component that does the heavy lifting with regards to behavior
 * and accessibility while not being opinionated with styling and the content it renders.
 *
 * @remarks
 * This component accepts a className prop for styling as well as a prop to
 * render the button as a link.
 *
 * A common use case for this component is to render a clickable icon, but note
 * that the component is content agnostic. This component will also be used to handle
 * the core button logic within the Button, IconButton, and DropdownButton components.
 *
 * @example
 * ```tsx
 * <UnstyledButton className="classname">
 *   <Icon symbol={iconSymbol} />
 * </Tooltip>
 * ```
 */
export const UnstyledButton = forwardRef<null, UnstyledButtonProps>(
  (props, inRef) => {
    const {
      className = "",
      href = "",
      children = "Button",
      isDisabled = false,
      ...restProps
    } = props;

    const ref = useRef(null);
    const As = href ? "a" : "button";
    const { buttonProps: elementProps } = useButton(
      { ...props, elementType: As },
      ref,
    );

    return (
      <As
        {...mergeProps(omitReactAriaSpecificProps(restProps), elementProps)}
        disabled={isDisabled}
        ref={mergeRefs(ref, inRef)}
        className={classNames(className)}
      >
        {children}
      </As>
    );
  },
);

UnstyledButton.displayName = "UnstyledButton";
