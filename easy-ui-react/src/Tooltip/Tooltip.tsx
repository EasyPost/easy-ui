import React, { ReactElement } from "react";
import {
  OverlayContainer,
  PositionProps,
  TooltipTriggerProps,
  mergeProps,
  useOverlayPosition,
  useTooltip,
  useTooltipTrigger,
} from "react-aria";
import { useTooltipTriggerState } from "react-stately";

type TooltipProps = TooltipTriggerProps &
  PositionProps & {
    text: string;
    children: ReactElement;
  };

export function Tooltip({
  delay,
  closeDelay,
  trigger,
  isDisabled,
  isOpen,
  defaultOpen,
  onOpenChange,
  placement,
  containerPadding,
  offset,
  crossOffset,
  shouldFlip,
  text,
  children,
}: TooltipProps) {
  const triggerRef = React.useRef(null);
  const tooltipRef = React.useRef(null);

  const tooltipTriggerProps = {
    closeDelay,
    defaultOpen,
    delay,
    isDisabled,
    isOpen,
    onOpenChange,
    trigger,
  };

  const overlayInProps = {
    placement,
    containerPadding,
    offset,
    crossOffset,
    shouldFlip,
  };

  const state = useTooltipTriggerState(tooltipTriggerProps);
  const { triggerProps, tooltipProps: triggerTooltipProps } = useTooltipTrigger(
    tooltipTriggerProps,
    state,
    triggerRef,
  );
  const { tooltipProps } = useTooltip(triggerTooltipProps, state);

  const {
    overlayProps,
    // arrowProps,
    placement: overlayPlacement,
  } = useOverlayPosition({
    targetRef: triggerRef,
    overlayRef: tooltipRef,
    isOpen: state.isOpen,
    ...overlayInProps,
  });

  return (
    <>
      {React.cloneElement(children, { ...triggerProps, ref: triggerRef })}
      {state.isOpen && (
        <OverlayContainer>
          <span
            ref={tooltipRef}
            data-placement={overlayPlacement}
            {...overlayProps}
            {...mergeProps(triggerTooltipProps, tooltipProps)}
          >
            {text}
          </span>
        </OverlayContainer>
      )}
    </>
  );
}
