import { useId } from "@react-aria/utils";
import React, { ReactNode, useEffect, useMemo, useRef } from "react";
import { Placement } from "react-aria";
// The local `Popover` is this directory's own component, so React Aria's has to
// be renamed to sit next to it.
import { Dialog, Popover as AriaPopover } from "react-aria-components";
import { Box, BoxStyleProps } from "../Box";
// Generic overlay geometry that predates this component. It lives in `Menu/`
// only because `Menu` was the first overlay to need it.
import { OVERLAY_PADDING_FROM_CONTAINER } from "../Menu/utilities";
import { sanitizeCustomProperties } from "../utilities/css";
import {
  InternalPopoverOverlayContext,
  useInternalPopoverContext,
} from "./PopoverContext";
import {
  DEFAULT_POPOVER_PLACEMENT,
  DEFAULT_POPOVER_WIDTH,
  PopoverWidth,
  getPopoverWidthStyles,
} from "./utilities";

import styles from "./Popover.module.scss";

/**
 * Style props forwarded to the container, minus the two whose popover meanings
 * take precedence—`width`, because it carries the trigger-relative keywords, and
 * `maxHeight`, because React Aria measures against it while positioning.
 */
type PopoverContainerStyleProps = Omit<BoxStyleProps, "maxHeight" | "width">;

export type PopoverOverlayProps = PopoverContainerStyleProps & {
  /**
   * Accessibility label for the popover, for when it doesn't render a
   * `<Popover.Title />`.
   */
  "aria-label"?: string;
  /** The content of the popover. */
  children: ReactNode;
  /**
   * The padding that should be applied between the popover and its surrounding
   * container.
   * @default 12
   */
  containerPadding?: number;
  /**
   * The additional offset applied along the cross axis between the popover and
   * its trigger.
   * @default 0
   */
  crossOffset?: number;
  /**
   * Whether pressing the escape key closes the popover.
   * @default false
   */
  isKeyboardDismissDisabled?: boolean;
  /**
   * The maximum height of the popover. `<Popover.Body />` scrolls beyond it.
   * Constrained to the viewport regardless.
   */
  maxHeight?: number;
  /**
   * The additional offset applied along the main axis between the popover and
   * its trigger.
   * @default 8
   */
  offset?: number;
  /**
   * The placement of the popover with respect to its trigger.
   * @default bottom start
   */
  placement?: Placement;
  /**
   * Whether the popover should flip to the opposite side of its trigger when
   * there isn't enough room for the requested placement.
   * @default true
   */
  shouldFlip?: boolean;
  /**
   * The width of the popover. `fit-content` sizes it to its content, `auto` is
   * at least the trigger's width but grows for wider content, `trigger` is the
   * trigger's width exactly, and anything else is used as an explicit width.
   * @default fit-content
   */
  width?: PopoverWidth;
};

export function PopoverOverlay(props: PopoverOverlayProps) {
  const {
    "aria-label": ariaLabel,
    children,
    containerPadding = OVERLAY_PADDING_FROM_CONTAINER,
    crossOffset,
    isKeyboardDismissDisabled,
    maxHeight,
    offset,
    placement = DEFAULT_POPOVER_PLACEMENT,
    shouldFlip,
    width = DEFAULT_POPOVER_WIDTH,
    ...containerStyleProps
  } = props;

  const { state, triggerRef, overlayProps } = useInternalPopoverContext();
  const bodyRef = useRef<HTMLDivElement | null>(null);

  // A plain id rather than `useSlotId()`, which resolves to `undefined` for a
  // render whenever the title isn't in the DOM yet—every time the popover
  // opens, in other words—and React Aria warns about the unlabeled dialog
  // during that render. Handing over an id unconditionally keeps both libraries
  // quiet; the guard below is what catches a genuinely unlabeled popover.
  const titleId = useId();

  // Checking the DOM rather than the children tree means this holds however
  // deeply `<Popover.Title />` is nested. Only meaningful while open, since
  // nothing inside the overlay is mounted otherwise.
  const isOpen = state.isOpen;
  useEffect(() => {
    if (
      process.env.NODE_ENV !== "production" &&
      isOpen &&
      !ariaLabel &&
      !document.getElementById(titleId)
    ) {
      console.warn(
        "A Popover.Overlay should contain a Popover.Title or be given an aria-label so it has an accessible name",
      );
    }
  }, [ariaLabel, isOpen, titleId]);

  const context = useMemo(() => ({ titleId, bodyRef }), [titleId]);

  return (
    <AriaPopover
      containerPadding={containerPadding}
      crossOffset={crossOffset}
      isKeyboardDismissDisabled={isKeyboardDismissDisabled}
      maxHeight={maxHeight}
      offset={offset}
      placement={placement}
      shouldFlip={shouldFlip}
      triggerRef={triggerRef}
      scrollRef={bodyRef}
      className={styles.popover}
      style={sanitizeCustomProperties(getPopoverWidthStyles(width))}
    >
      {/* The surface itself, as a `<Box />` rather than a rule in this
      directory's stylesheet, so a consumer can restyle it with the same style
      props they'd use anywhere else. Defaults come first so their own win.
      React Aria finds the dialog below with a descendant query, so sitting
      between the two costs nothing. */}
      <Box
        display="flex"
        flexDirection="column"
        flex="auto"
        minHeight={0}
        // Keeps a scrolled body from painting over the rounded corners.
        overflow="hidden"
        // The same surface `Menu`, `Select`, and `MultiSelect` share through
        // `Menu/_mixins.scss`, so the anchored surfaces read as one family. The
        // shadow is the one value that couldn't match exactly: theirs is
        // `shadow.overlay`, and `Box`'s `boxShadow` only takes the
        // `shadow.level` scale, of which `1` is the closest.
        background="neutral.000"
        borderColor="neutral.300"
        borderWidth="1"
        borderRadius="md"
        boxShadow="1"
        {...containerStyleProps}
      >
        {/* This must stay unconditional. React Aria gives its own positioned
        element `role="dialog"` unless it finds one nested inside, so rendering
        this conditionally would hand the popover two dialogs. */}
        <Dialog
          id={overlayProps.id}
          aria-label={ariaLabel}
          aria-labelledby={titleId}
          className={styles.dialog}
        >
          <InternalPopoverOverlayContext.Provider value={context}>
            {children}
          </InternalPopoverOverlayContext.Provider>
        </Dialog>
      </Box>
    </AriaPopover>
  );
}
