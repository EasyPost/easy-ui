import React, {
  DOMAttributes,
  MutableRefObject,
  ReactElement,
  ReactNode,
  useLayoutEffect,
} from "react";
import {
  Overlay,
  Placement,
  mergeProps,
  useOverlayPosition,
  useTooltip,
  useTooltipTrigger,
} from "react-aria";
import { TooltipTriggerState, useTooltipTriggerState } from "react-stately";
import { Text } from "../Text";
import { classNames, getComponentToken, pxToRem } from "../utilities/css";

import styles from "./Tooltip.module.scss";

const CONTAINER_PADDING = 12;
const ARROW_BOUNDARY_OFFSET = 12;
const OFFSET = 12;
const DEFAULT_PLACEMENT = "top";
const OPEN_DELAY = 1000;
const CLOSE_DELAY = 250;

export type TooltipProps = {
  /** The element that will activate to tooltip. */
  children: ReactElement;

  /** The content to display within the tooltip. */
  content: ReactNode;

  /** Whether the overlay is open by default (uncontrolled). */
  defaultOpen?: boolean;

  /** Whether the tooltip should be disabled, independent from the trigger. */
  isDisabled?: boolean;

  /** By default, opens after a delay. Can be made to open immediately. Useful for help icons. */
  isImmediate?: boolean;

  /** Whether the overlay is open by default (controlled). */
  isOpen?: boolean;

  /** Handler that is called when the overlay's open state changes. */
  onOpenChange?: (isOpen: boolean) => void;

  /**
   * The placement of the element with respect to its anchor element.
   * @default 'top'
   */
  placement?: Placement;

  /** By default, opens for both focus and hover. Can be made to open only for focus. */
  trigger?: "focus";
};

/**
 * An overlay that shows contextual help or information about specific
 * components when a user hovers or focuses on them.
 *
 * @remarks
 * A tooltip must only be placed on a natively focusable HTML element. Good
 * candidates include a `<button />`, `<a />`, or Easy UI equivalent such as
 * `<Button />` or `<IconButton />`.
 *
 * Use `isImmediate` for tooltips attached to help icons. For conventional UI
 * elements where a tooltip appearing immediately would be intrusive, delay
 * appearance with a warmup period by not using `isImmediate`.
 *
 * @example
 * ```tsx
 * <Tooltip content="This will be a permanent action">
 *   <Button>Delete</Button>
 * </Tooltip>
 * ```
 *
 * @example
 * Custom placement:
 * ```tsx
 * <Tooltip placement="bottom start" content="This will be a permanent action">
 *   <Button>Delete</Button>
 * </Tooltip>
 * ```
 *
 * @example
 * Controlled:
 * ```tsx
 * <Tooltip
 *   isOpen={isOpen}
 *   onOpenChange={setIsOpen}
 *   content="This will be a permanent action"
 * >
 *   <Button>Delete</Button>
 * </Tooltip>
 * ```
 *
 * @example
 * Show immediately:
 * ```tsx
 * <Tooltip isImmediate content="This will be a permanent action">
 *   <Button>Delete</Button>
 * </Tooltip>
 * ```
 */
export function Tooltip(props: TooltipProps) {
  const { children, isImmediate } = props;

  const triggerRef = React.useRef(null);

  const triggerInputProps = {
    ...props,
    delay: isImmediate ? 0 : OPEN_DELAY,
    closeDelay: CLOSE_DELAY,
  };

  const tooltipTriggerState = useTooltipTriggerState(triggerInputProps);

  const { triggerProps, tooltipProps: tooltipPropsFromTrigger } =
    useTooltipTrigger(triggerInputProps, tooltipTriggerState, triggerRef);

  return (
    <>
      {React.cloneElement(children, {
        ...mergeProps(triggerProps, children.props),
        ref: triggerRef,
      })}
      {tooltipTriggerState.isOpen && (
        <Overlay>
          <TooltipInner
            {...props}
            triggerRef={triggerRef}
            tooltipPropsFromTrigger={tooltipPropsFromTrigger}
            tooltipTriggerState={tooltipTriggerState}
          />
        </Overlay>
      )}
    </>
  );
}

type TooltipInnerProps = TooltipProps & {
  triggerRef: MutableRefObject<null>;
  tooltipPropsFromTrigger: DOMAttributes<HTMLElement>;
  tooltipTriggerState: TooltipTriggerState;
};

function TooltipInner(props: TooltipInnerProps) {
  const {
    content,
    placement: targetPlacement = DEFAULT_PLACEMENT,
    triggerRef,
    tooltipTriggerState,
    tooltipPropsFromTrigger,
  } = props;

  const tooltipRef = React.useRef(null);

  const { overlayProps, arrowProps, placement, updatePosition } =
    useOverlayPosition({
      arrowBoundaryOffset: ARROW_BOUNDARY_OFFSET,
      containerPadding: CONTAINER_PADDING,
      isOpen: tooltipTriggerState.isOpen,
      offset: OFFSET,
      overlayRef: tooltipRef,
      placement: targetPlacement,
      targetRef: triggerRef,
    });

  const { tooltipProps: tooltipPropsFromTooltip } = useTooltip(
    mergeProps(overlayProps, props),
    tooltipTriggerState,
  );

  const tooltipProps = mergeProps(
    overlayProps,
    tooltipPropsFromTooltip,
    tooltipPropsFromTrigger,
  );

  const style = {
    ...tooltipProps.style,
    ...getComponentToken(
      "tooltip",
      "container_padding",
      `${pxToRem(CONTAINER_PADDING)}rem`,
    ),
  } as React.CSSProperties;

  // When the content of the tooltip changes, update the overlay position
  useLayoutEffect(() => {
    updatePosition();
  }, [content, updatePosition]);

  return (
    <span
      ref={tooltipRef}
      {...tooltipProps}
      className={classNames(styles.Tooltip, placement && styles[placement])}
      data-placement={placement}
      style={style}
    >
      <span className={styles.text}>
        <Text variant="subtitle2">{content}</Text>
      </span>
      <span className={styles.arrow} {...arrowProps} />
    </span>
  );
}
