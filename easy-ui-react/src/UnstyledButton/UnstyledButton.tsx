import { mergeRefs, useObjectRef } from "@react-aria/utils";
import omit from "lodash/omit";
import React, { forwardRef, useRef } from "react";
import { AriaButtonProps, mergeProps, useButton } from "react-aria";
import { classNames } from "../utilities/css";
import { RouterLinkProps, useRouterLinkProps } from "../utilities/router";
import { omitReactAriaSpecificProps } from "../Button/utilities";

import styles from "./UnstyledButton.module.scss";

export type UnstyledButtonProps = AriaButtonProps<"button"> &
  RouterLinkProps & {
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
    const mergedRef = useObjectRef(mergeRefs(ref, inRef));
    const As = href ? "a" : "button";
    // `useButton()` hands `onClick` to `usePress()`, which calls it from the
    // `onClick` it returns, so exactly one of that path and the DOM spread below
    // can carry the consumer's handler—both would fire it twice per click.
    //
    // Which one depends on the element. On a `<button>`, `usePress()` prevents
    // the default keyboard behavior, so there is no native click on Enter or
    // Space and `onClick` only arrives through `usePress()`. An anchor keeps its
    // native click, and there `usePress()` is the wrong path: on keyboard
    // activation it synthesizes an event, and `preventDefault()` on that fake
    // event can't stop the real click the router reads.
    const { buttonProps: elementProps } = useButton(
      { ...props, onClick: href ? undefined : props.onClick, elementType: As },
      ref,
    );

    // `useButton()` renders `href` as a plain attribute, so client-side
    // navigation has to be wired up separately. This is a noop until a
    // `navigate` function is passed to `<Provider />`. Disabled buttons are left
    // out; `useButton()` withholds their `href` and re-adding it here would make
    // them navigable.
    const routerLinkProps = useRouterLinkProps(props, !isDisabled);

    return (
      <As
        {...mergeProps(
          omitReactAriaSpecificProps(
            href ? restProps : omit(restProps, "onClick"),
          ),
          elementProps,
          routerLinkProps,
        )}
        disabled={isDisabled}
        ref={mergedRef}
        className={classNames(styles.UnstyledButton, className)}
      >
        {children}
      </As>
    );
  },
);

UnstyledButton.displayName = "UnstyledButton";
