---
status: Approved
date: 2026-09-17
deciders: stephenjwatkins
---

# Build new overlays on react-aria-components rather than the react-aria hooks

## Context and Problem Statement

Easy UI's overlays are built two different ways. `Menu`, `Select`, and `DatePicker` compose the `react-aria` hooks by hand — `usePopover` + `Overlay` + an underlay `div` + two `DismissButton`s, plus a `useTriggerWidth` measurement pass. `MultiSelect`, `ColorPicker`, and `ForgeLayout` use `react-aria-components` instead. Neither approach is written down as the preferred one, so each new overlay re-litigates the question.

Adding `Popover` forced the question, because it's the first overlay whose only job is to be an overlay. Everything the hooks path makes us hand-write is code with no Easy UI-specific content in it, and the hand-rolled copies have already drifted: three of them disagree on their surface tokens, one hardcodes a `crossOffset={116}` pixel nudge, and one ships without an accessible name.

## Decision Drivers

- Less hand-written overlay plumbing to maintain and to get wrong
- Correct accessibility by default, not by remembering
- Consistency with how the library already builds overlays
- No new dependency
- Keeping Easy UI's own component API conventions intact — `react-aria-components` must not leak into the public surface

## Options Considered

- Compose the `react-aria` hooks, following `Menu` / `Select` / `DatePicker`.
- Build on `react-aria-components`, following `MultiSelect` / `ColorPicker` / `ForgeLayout`.

## Decision Outcome

**`react-aria-components`.** It's already the more common choice in the library — eight component directories import from it — and it isn't a new dependency, so this records an existing direction rather than starting one. Two objections to it looked disqualifying at first and both dissolve on inspection of `react-aria-components@1.20.0`:

_"Its `Popover` will fight us for `role="dialog"`."_ Real, but self-resolving. It claims the role for its own positioned element only when it doesn't find a nested `[role=dialog]`, so nesting its `Dialog` makes the answer deterministically no. `ForgeLayoutModeSwitcher` already relies on this.

_"It needs a react-aria-pressable trigger, so we'd lose our clone-child trigger."_ True only of its `DialogTrigger`, which we don't use. Its `Popover` documents `triggerRef` as "only required when used standalone", and it prefers a state object published on `OverlayTriggerStateContext` over the one it would build for itself. Providing that context hands it our own `useOverlayTriggerState`, so the house clone-child trigger and any Easy UI `forwardRef` component keep working.

What that buys, all of which the hooks path makes us write by hand: both `DismissButton`s, the underlay element, `--trigger-width` via its own `ResizeObserver`, `data-placement` / `data-trigger` / `--trigger-anchor-point`, `data-entering` / `data-exiting`, and a portal container for nested sub-popovers. `--trigger-width` is the biggest one — it eliminates `useTriggerWidth` and the `triggerWidth === null` first-paint gate that `MenuOverlay` and `SelectOverlay` need, so a trigger-width overlay costs no dropped commit. `data-entering` / `data-exiting` are pure CSS, where `Drawer` had to take on `react-transition-group` for the equivalent.

The positioning props we care about survive: `PopoverProps` omits only `popoverRef`, `triggerRef`, `groupRef`, `offset`, and `arrowSize` from `AriaPopoverProps`, so `maxHeight`, `scrollRef`, `containerPadding`, `crossOffset`, `placement`, `shouldFlip`, and `isKeyboardDismissDisabled` all forward through to `usePopover` unchanged.

### Scope of this decision

**New overlays.** It is explicitly not a mandate to rewrite `MenuOverlay`, `SelectOverlay`, or `DatePickerOverlay`: they work, they carry distinct a11y roles, and `MenuOverlay` has select-all machinery that would have to move. Rewriting them buys nothing a user can see.

It is also not a decision about `react-aria-components` in general. Easy UI's API conventions still govern: components own their own props and their own stylesheets, expose no `className`, and never re-export a `react-aria-components` type as public API. `react-aria-components` is an implementation detail behind that surface, exactly as the hooks are.

### Consequences

Two mechanics stop being explicit and have to be understood, which is the real cost:

**Focus containment becomes indirect.** Because the `Dialog` is nested, `react-aria-components` passes `shouldContainFocus: false` to its `Overlay`. Containment still holds — the nested `Dialog` calls `useDialog`, which calls `useOverlayFocusContain`, which flips the ancestor `Overlay`'s `FocusScope` to `contain` through context — but nothing in our code says so. A test that tabs off the last focusable element and asserts the wrap is the guard.

**The `role="dialog"` handshake is effect-ordered.** The nested `Dialog` must render unconditionally. Rendering it conditionally would let the positioned element reclaim the role on a later layout effect and produce two dialogs, with no error to point at it.

And one deliberate deviation from `react-aria-components`' own idiom: it publishes a dialog's `titleProps` only through `HeadingContext`'s `title` slot, expecting its own `Heading slot="title"`. Easy UI's `Text` doesn't read that context, so `Popover.Overlay` mints the id itself with `useId()` and `Popover.Title` claims it. `useSlotId()` would be the closer fit but resolves to `undefined` for the render in which the title isn't in the DOM yet — every open — and `react-aria-components` warns about the unlabeled dialog during that render. A development-time warning of our own catches the genuinely unlabeled case instead.

## Design

`Popover.Overlay` is the whole integration:

```tsx
// The local `Popover` is this directory's own component, so React Aria's has to
// be renamed to sit next to it.
import { Dialog, Popover as AriaPopover } from "react-aria-components";

export function PopoverOverlay(props: PopoverOverlayProps) {
  const { state, triggerRef, overlayProps } = useInternalPopoverContext();
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const titleId = useId();

  return (
    <AriaPopover
      triggerRef={triggerRef}
      scrollRef={bodyRef}
      placement={placement}
      containerPadding={containerPadding}
      maxHeight={maxHeight}
      className={styles.popover}
      style={sanitizeCustomProperties(getPopoverWidthStyles(width))}
    >
      {/* The surface, as a `<Box />` so a consumer can restyle it with style
      props instead of a `className` escape hatch. React Aria finds the dialog
      with a descendant query, so this layer costs nothing. */}
      <Box background="neutral.000" borderRadius="md" {...containerStyleProps}>
        {/* This must stay unconditional. React Aria gives its own positioned
        element `role="dialog"` unless it finds one nested inside, so rendering
        this conditionally would hand the popover two dialogs. */}
        <Dialog
          id={overlayProps.id}
          aria-label={ariaLabel}
          aria-labelledby={titleId}
          className={styles.dialog}
        >
          {children}
        </Dialog>
      </Box>
    </AriaPopover>
  );
}
```

The root publishes both contexts, which is what lets the house trigger and `react-aria-components` share one source of truth:

```tsx
const state = useOverlayTriggerState(props);
const { triggerProps, overlayProps } = useOverlayTrigger(
  { type: "dialog" },
  state,
  triggerRef,
);

return (
  <InternalPopoverContext.Provider value={context}>
    <OverlayTriggerStateContext.Provider value={state}>
      {children}
    </OverlayTriggerStateContext.Provider>
  </InternalPopoverContext.Provider>
);
```

Three placement details are worth keeping in one place, since getting any of them wrong fails silently:

- `aria-label` and `aria-labelledby` go on the `Dialog`, not on `AriaPopover` — otherwise they'd label a roleless `div`.
- `id` on the `Dialog` comes from `useOverlayTrigger`'s `overlayProps`, and is required: `react-aria-components` drops `props.id` from the positioned element when it isn't the dialog, so the trigger's `aria-controls` would point at nothing.
- `getPopoverWidthStyles` must never write `--trigger-width` itself, because `react-aria-components` skips its own `ResizeObserver` when that property is already set in `style`.

## Resources

- [React Aria Components](https://react-spectrum.adobe.com/react-aria/components.html)
- [`Popover` specification](../specs/Popover.md)
</content>
