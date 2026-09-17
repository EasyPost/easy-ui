import React, { ReactNode, useMemo, useRef } from "react";
import { useOverlayTrigger } from "react-aria";
import { OverlayTriggerStateContext } from "react-aria-components";
import { useOverlayTriggerState } from "react-stately";
import { InternalPopoverContext, usePopoverTrigger } from "./PopoverContext";
import { PopoverBody } from "./PopoverBody";
import { PopoverFooter } from "./PopoverFooter";
import { PopoverHeader } from "./PopoverHeader";
import { PopoverOverlay } from "./PopoverOverlay";
import { PopoverTitle } from "./PopoverTitle";
import { PopoverTrigger } from "./PopoverTrigger";

export type PopoverProps = {
  /** The trigger and the overlay. */
  children: ReactNode;
  /** Whether the popover is open by default (uncontrolled). */
  defaultOpen?: boolean;
  /** Whether the popover is open (controlled). */
  isOpen?: boolean;
  /** Handler that is called when the popover's open state changes. */
  onOpenChange?: (isOpen: boolean) => void;
};

/**
 * A `<Popover />` displays arbitrary content in an overlay anchored to a
 * trigger.
 *
 * @remarks
 * Use this for content that doesn't fit an existing overlay's shape—a form, a
 * summary, a list of rich rows. Reach for `<Menu />` or `<Select />` instead
 * when the overlay holds selectable options, `<Modal />` when the flow should
 * block the page, and `<Tooltip />` for a hover hint.
 *
 * The overlay is a dialog: it contains focus while open, restores focus to the
 * trigger on close, and closes on escape or an outside press. It needs an
 * accessible name, from either a `<Popover.Title />` or an `aria-label` on
 * `<Popover.Overlay />`.
 *
 * Content can be passed to `<Popover.Overlay />` directly, or split across
 * `<Popover.Header />`, `<Popover.Body />`, and `<Popover.Footer />`, in which
 * case the header and footer stay pinned and only the body scrolls.
 *
 * `<Popover.Trigger />` clones its child with the props that open the overlay,
 * so the child has to forward its ref and spread the props it's handed. Easy
 * UI's buttons all do; so can a consumer's own component.
 *
 * @example
 * _Simple:_
 * ```tsx
 * import { Popover } from "@easypost/easy-ui/Popover";
 * import { DropdownButton } from "@easypost/easy-ui/DropdownButton";
 *
 * export function Component() {
 *  return (
 *    <Popover>
 *      <Popover.Trigger>
 *        <DropdownButton>Filters</DropdownButton>
 *      </Popover.Trigger>
 *      <Popover.Overlay aria-label="Filters">Content</Popover.Overlay>
 *    </Popover>
 *  );
 * }
 * ```
 *
 * @example
 * _With a header, body, and footer:_
 * ```tsx
 * import { Popover } from "@easypost/easy-ui/Popover";
 * import { Button } from "@easypost/easy-ui/Button";
 * import { SelectButton } from "@easypost/easy-ui/Select";
 *
 * export function Component() {
 *  return (
 *    <Popover>
 *      <Popover.Trigger>
 *        <SelectButton>Add Packaging</SelectButton>
 *      </Popover.Trigger>
 *      <Popover.Overlay maxHeight={400}>
 *        <Popover.Header>
 *          <Popover.Title>Shipment Packaging</Popover.Title>
 *        </Popover.Header>
 *        <Popover.Body>Content</Popover.Body>
 *        <Popover.Footer>
 *          <Button>Packaging Complete</Button>
 *        </Popover.Footer>
 *      </Popover.Overlay>
 *    </Popover>
 *  );
 * }
 * ```
 *
 * @example
 * _Closing from inside the overlay:_
 * ```tsx
 * import { Popover, usePopoverTrigger } from "@easypost/easy-ui/Popover";
 * import { Button } from "@easypost/easy-ui/Button";
 *
 * function DoneButton() {
 *  const { close } = usePopoverTrigger();
 *  return <Button onPress={close}>Done</Button>;
 * }
 * ```
 */
export function Popover(props: PopoverProps) {
  const { children } = props;

  const triggerRef = useRef<HTMLElement | null>(null);
  const state = useOverlayTriggerState(props);

  // `triggerRef` registers the trigger for react-aria's close-on-scroll
  // handling, so the popover doesn't drift away from a trigger that scrolls out
  // from under it.
  const { triggerProps, overlayProps } = useOverlayTrigger(
    { type: "dialog" },
    state,
    triggerRef,
  );

  const context = useMemo(
    () => ({ state, triggerProps, triggerRef, overlayProps }),
    [state, triggerProps, overlayProps],
  );

  return (
    <InternalPopoverContext.Provider value={context}>
      {/* React Aria Components' own `Popover` prefers this context over the
      state it would otherwise build for itself, which is what lets the trigger
      and the overlay share one source of truth. */}
      <OverlayTriggerStateContext.Provider value={state}>
        {children}
      </OverlayTriggerStateContext.Provider>
    </InternalPopoverContext.Provider>
  );
}

/**
 * The element that opens the popover.
 *
 * @remarks
 * Should be rendered as a child of `<Popover />` as `<Popover.Trigger />`,
 * wrapping a single focusable element.
 */
Popover.Trigger = PopoverTrigger;

/**
 * The popover's overlay, positioned against the trigger.
 *
 * @remarks
 * Should be rendered as a child of `<Popover />` as `<Popover.Overlay />`.
 */
Popover.Overlay = PopoverOverlay;

/**
 * A pinned region at the top of the popover, for a `<Popover.Title />`.
 *
 * @remarks
 * Should be rendered as a child of `<Popover.Overlay />` as
 * `<Popover.Header />`.
 */
Popover.Header = PopoverHeader;

/**
 * The popover's heading, which supplies its accessible name.
 *
 * @remarks
 * Should be rendered inside `<Popover.Header />` as `<Popover.Title />`.
 */
Popover.Title = PopoverTitle;

/**
 * The popover's scrolling region.
 *
 * @remarks
 * Should be rendered as a child of `<Popover.Overlay />` as
 * `<Popover.Body />`. This is the only part of the popover that scrolls.
 */
Popover.Body = PopoverBody;

/**
 * A pinned region at the bottom of the popover, for actions.
 *
 * @remarks
 * Should be rendered as a child of `<Popover.Overlay />` as
 * `<Popover.Footer />`.
 */
Popover.Footer = PopoverFooter;

export { usePopoverTrigger };
export type { PopoverBodyProps } from "./PopoverBody";
export type { PopoverFooterProps } from "./PopoverFooter";
export type { PopoverHeaderProps } from "./PopoverHeader";
export type { PopoverOverlayProps } from "./PopoverOverlay";
export type { PopoverTitleProps } from "./PopoverTitle";
export type { PopoverTriggerProps } from "./PopoverTrigger";
export type { PopoverWidth } from "./utilities";
