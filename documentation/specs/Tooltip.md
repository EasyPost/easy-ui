# `Tooltip` Component Specification

## Overview

A Tooltip shows contextual help or information about specific components when a user hovers or focuses on them.

### Use Cases

- Provide informative text to the user on keyboard focus or mouse hover

### Features

- Custom placement
- Ability to disable independent of its trigger
- Custom trigger mode (hover and focus, or just focus)
- Ability to be controlled or uncontrolled

### Risks and Challenges

- Ensuring tooltips don't get cut off within hidden containers
- Keeping the API elegantly simple while needing to be aware of inner element `ref`s and needing to pass `prop`s to inner components
- Will need to ensure that Easy UI components are forwarding refs in order to handle ref attachment

### Prior Art

- [Paste `<Tooltip />`](https://paste.twilio.design/components/tooltip)
- [Spectrum `<Tooltip />`](https://react-spectrum.adobe.com/react-spectrum/Tooltip.html)

---

## Design

### API

React Aria exposes a lot of functionality for placement and behavior, but the API for Easy UI's `Tooltip` component will be intentionally limited to reduce inconsistency across the UIs. Instead, the component will hold the specific React Aria configuration optimal for EasyPost. We can expose functionality on a per-needed basis as it arises in the future.

```ts
// prettier-ignore
type Placement = 'bottom' | 'bottom left' | 'bottom right' | 'bottom start' | 'bottom end' |
    'top' | 'top left' | 'top right' | 'top start' | 'top end' |
    'left' | 'left top' | 'left bottom' | 'start' | 'start top' | 'start bottom' |
    'right' | 'right top' | 'right bottom' | 'end' | 'end top' | 'end bottom';

type Tooltip = {
  /** The element that will activate to tooltip. */
  children: ReactNode;

  /** The content to display within the tooltip. */
  content: ReactNode;

  /** Whether the overlay is open by default (uncontrolled). */
  defaultOpen?: boolean;

  /** Whether the tooltip should be disabled, independent from the trigger. */
  isDisabled?: boolean;

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
```

### Anatomy

The bulk of the `Tooltip` component behavior will be handled by React Aria. It offers primitives for handling the opening and closing of the tooltip, assigning accessibility labels, and positioning the underlying overlay.

It's important that the tooltip is rendered through a Portal at the end of the document so that it's not inadvertantly cut off within a container that has overflow hidden. This is handled by React Aria through its `OverlayContainer` component.

```ts
export function Tooltip(props: TooltipProps) {
  const triggerRef = React.useRef(null);
  const tooltipRef = React.useRef(null);

  const inTooltipTriggerProps = {
    defaultOpen: props.defaultOpen,
    isDisabled: props.isDisabled,
    isOpen: props.isOpen,
    onOpenChange: props.onOpenChange,
    trigger: props.trigger,
  };

  const inOverlayProps = {
    placement: props.placement,
  };

  const state = useTooltipTriggerState(inTooltipTriggerProps);
  const { triggerProps, tooltipProps: triggerTooltipProps } = useTooltipTrigger(
    inTooltipTriggerProps,
    state,
    triggerRef,
  );
  const { tooltipProps } = useTooltip(triggerTooltipProps, state);

  const {
    overlayProps,
    arrowProps,
    placement: overlayPlacement,
  } = useOverlayPosition({
    targetRef: triggerRef,
    overlayRef: tooltipRef,
    isOpen: state.isOpen,
    ...inOverlayProps,
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
            <span>{text}</span>
            <span className="arrow" {...arrowProps} />
          </span>
        </OverlayContainer>
      )}
    </>
  );
}
```

### Example Usage

_Default:_

```tsx
import { Tooltip } from "@easypost/easy-ui/Tooltip";

function Component() {
  return (
    <Tooltip content="This will be a permanent action">
      <Button>Delete</Button>
    </Tooltip>
  );
}
```

_Custom placement:_

```tsx
import { Tooltip } from "@easypost/easy-ui/Tooltip";

function Component() {
  return (
    <Tooltip placement="bottom start" content="This will be a permanent action">
      <Button>Delete</Button>
    </Tooltip>
  );
}
```

_Trigger only on keyboard focus:_

```tsx
import { Tooltip } from "@easypost/easy-ui/Tooltip";

function Component() {
  return (
    <Tooltip trigger="focus" content="This will be a permanent action">
      <Button>Delete</Button>
    </Tooltip>
  );
}
```

_Controlled tooltip:_

```tsx
import { Tooltip } from "@easypost/easy-ui/Tooltip";

function Component() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Tooltip
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      content="This will be a permanent action"
    >
      <Button>Delete</Button>
    </Tooltip>
  );
}
```

_Open by default:_

```tsx
import { Tooltip } from "@easypost/easy-ui/Tooltip";

function Component() {
  return (
    <Tooltip defaultOpen={true} content="This will be a permanent action">
      <Button>Delete</Button>
    </Tooltip>
  );
}
```

_Disable tooltip independent of trigger:_

```tsx
import { Tooltip } from "@easypost/easy-ui/Tooltip";

function Component() {
  return (
    <Tooltip isDisabled={true} content="This will be a permanent action">
      <Button>Delete</Button>
    </Tooltip>
  );
}
```

---

## Behavior

### Accessibility

A tooltip must only be placed on a natively focusable HTML element. Good candidates include a `<button />`, `<a />`, or Easy UI equivalent such as `<Button />` or `<IconButton />`.

Do not place tooltips on non-focusable elements, like an icon.

If your tooltip wraps a natively focusable HTML element that includes only an icon, make sure you set the prop accessibility configuration on the icon, such as giving it an `accessibilityLabel`. The title of the icon should be the accessible name for the button action, like "Delete phone number". The tooltip provides the additional context, like "You can delete phone numbers every 7 days". This ensures the icon and tooltip are accessible to screen readers.

When the user focuses an element with a tooltip, their focus stays on the element. Focus never goes inside the tooltip.

`<Tooltip />` automatically associates the tooltip with the trigger element using `aria-describedBy` so that it is described by the tooltip content.

## Dependencies

- `react-aria`—`useTooltipTrigger`, `useTooltip`, `OverlayContainer`, `useOverlayPosition`, `mergeProps`
- `react-stately`—`useTooltipTriggerState`
- `@react-aria/utils`—`mergeRefs`
