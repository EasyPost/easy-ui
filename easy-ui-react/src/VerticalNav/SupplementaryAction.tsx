import ArrowForwardIosIcon from "@easypost/easy-ui-icons/ArrowForwardIos";
import { DOMRef } from "@react-types/shared";
import React, {
  ComponentProps,
  ElementType,
  ReactElement,
  ReactNode,
  forwardRef,
} from "react";
import { mergeProps } from "react-aria";
import { Icon } from "../Icon";
import { Text } from "../Text";
import { RouterLinkProps, useRouterLinkProps } from "../utilities/router";

import styles from "./SupplementaryAction.module.scss";

export type SupplementaryActionProps<T extends ElementType = "button"> =
  ComponentProps<T> &
    RouterLinkProps & {
      /**
       * Custom element to render the supplementary action as.
       */
      as?: T;

      /**
       * Text content to render in the supplementary action.
       */
      children: ReactNode;
    };

/**
 * Represents a default supplementary action for a vertical navigation. Renders
 * as a text with arrow.
 *
 * The `supplementaryAction` slot can be rendered with a custom action component
 * if this one doesn't suffice.
 */
export const SupplementaryAction = forwardRef<
  HTMLButtonElement,
  SupplementaryActionProps
>((props, ref) => {
  const {
    as: As = "button",
    children,
    routerOptions: _routerOptions,
    ...elementProps
  } = props;
  const routerLinkProps = useRouterLinkProps(
    props,
    (As as ElementType) === "a",
  );
  return (
    <As
      ref={ref}
      className={styles.SupplementaryAction}
      {...mergeProps(elementProps, routerLinkProps)}
    >
      <Text variant="subtitle2">{children}</Text>
      <Icon symbol={ArrowForwardIosIcon} size="xs" />
    </As>
  );
}) as {
  <T extends ElementType = "button">(
    props: SupplementaryActionProps<T> & { ref?: DOMRef },
  ): ReactElement;
  displayName?: string;
};

SupplementaryAction.displayName = "SupplementaryAction";
