# `Popover` Component Specification

## Overview

A `Popover` displays arbitrary content in a dialog anchored to a trigger. It owns the anchored-rich-content pattern: a small form, a summary, a list of rich rows — anything that needs to float next to the element that opened it without blocking the page.

### Use Cases

Four designs motivated the component, and none of them can be built from Easy UI as it stands:

1. **Shipment Packaging** — a select-shaped trigger reading "Add Packaging" opens a wide panel with a heading, `in|cm` and `lb|oz` segmented toggles, a Package `Select` alongside a Total Weight `TextField`, and a "Packaging Complete" footer button.
2. **Custom Package** — the same shape plus Width/Height/Length/Package Weight, and two footer buttons.
3. **Select Rate** — a trigger-width panel of divider-separated multi-line rows (carrier icon, price, "Delivery: X", "From: Default Address") with a non-selectable "View 10 More" footer link.
4. **Items** — a two-line bordered summary-card trigger ("2 Items" / "King Zazi Sweater SKU 12345 + 1 More") opens a panel with an "Items" heading, a `Total Items | 2` pill, and product rows (thumbnail, title, variant, SKU link).

Every overlay in the library before this one is welded to a specific collection role, so none of the four is expressible:

| Site                                      | Role      | Notes                                                           |
| ----------------------------------------- | --------- | --------------------------------------------------------------- |
| `src/Menu/MenuOverlay.tsx`                | `menu`    | `usePopover` + `Overlay` + underlay + 2× `DismissButton`        |
| `src/Select/SelectOverlay.tsx`            | `listbox` | The same sandwich; imports `../Menu/utilities`                  |
| `src/DatePicker/DatePickerOverlay.tsx`    | `dialog`  | The same sandwich, already generic (`children` + `dialogProps`) |
| `src/MultiSelect/MultiSelectDropdown.tsx` | `listbox` | React Aria Components' `Popover`, `isNonModal`                  |
| `src/ColorPicker/ColorPicker.tsx`         | `dialog`  | React Aria Components' `DialogTrigger` + `Popover`              |
| `src/ForgeLayout/ForgeLayoutControls.tsx` | `dialog`  | A one-off, magic `crossOffset={116}`, **no accessible name**    |

`DatePickerOverlay` is roughly 90% of the target abstraction but is private to `DatePicker/`. So a consumer who needs rich anchored content either reaches for `Modal` — blocking, and wrong for a panel attached to a field — or hand-rolls a seventh copy. The three ad-hoc surfaces also disagree visually: `shadow.level.2` + `border_radius.lg` + no border, versus `shadow.overlay` + `md` + a `neutral.300` border, versus `Menu`'s own tokens.

The `crossOffset={116}` in `ForgeLayoutControls` is the clearest symptom. It's a hardcoded pixel nudge standing in for a placement the component couldn't express, in a file that also forgot to give its dialog an accessible name — which is what hand-rolling an overlay costs.

### Features

- **Arbitrary content in a `role="dialog"` overlay**, positioned against a trigger, with flipping and viewport containment.
- **One trigger mechanism.** `Popover.Trigger` clones its single child. Every Easy UI button works as that child; so does a consumer's own component, through the identical code path.
- **Optional Header / Body / Footer**, where the header and footer stay pinned and **only the body scrolls**.
- **`Popover.Title` supplies the accessible name**, so the common case needs no `aria-label`.
- **`usePopoverTrigger()`** lets content inside the overlay close it without prop drilling.
- **Trigger-relative widths**, as a floor (`auto`) or a hard width (`trigger`), with no measurement pass and no dropped first paint.
- **A select-shaped trigger**, `SelectButton`, extracted from `Select` and exported for reuse.
- No `className`, no `style`.

### Risks and Challenges

**The `SelectTrigger` refactor is the only shipped-behavior risk.** `SelectTrigger` is private and its public API doesn't change, but `Select` is widely used and its trigger is its most visible surface. The mitigation is that `Select`'s existing test suite passes untouched, plus a walk of every `Select` story — especially the descriptive two-line mode and all three sizes.

**The `role="dialog"` handshake is effect-ordered.** React Aria Components decides whether to claim `role="dialog"` for its own positioned element in a layout effect, by querying for a nested `[role=dialog]`. The nested `Dialog` always renders, so the answer is stable — but rendering it conditionally would let the positioned element silently reclaim the role and produce two dialogs. The comment in `PopoverOverlay.tsx` marking it unconditional is load-bearing.

**Focus containment is indirect.** React Aria Components passes `shouldContainFocus: false` to its `Overlay` here, because `isDialog` is false. Containment arrives instead through the nested `Dialog` → `useDialog` → `useOverlayFocusContain` → the ancestor `Overlay`'s `FocusScope`. It works, but nothing in `Popover`'s own code says so, which is why there's a test that tabs off the last focusable element and asserts the wrap.

**A `Popover` inside a `Modal` is safe by construction, and only barely.** `ModalUnderlay`'s `shouldCloseOnInteractOutside` reads a portaled popover click as outside, so the only thing preventing the modal from dismissing is `useOverlay`'s module-level `visibleOverlays` stack, which acts only for the topmost overlay. That's the same mechanism that makes `Select`-in-`Modal` work today, and it's the thing most likely to regress silently on a react-aria bump.

**The surface tokens had three conflicting precedents**, and were settled by counting: `Menu`, `Select`, and `MultiSelect` all render the same surface out of `Menu/_mixins.scss`, so `Popover` renders it too — white, `border_radius.md`, a 1px `neutral.300` border, `space.2` padding. A popover is a fourth anchored surface, and a fourth look was the one outcome worth avoiding. `DatePicker`'s heavier `border_radius.lg` + `shadow.modal` treatment reads as its own thing and stays that way.

**The shadow is the one value that couldn't match.** The dropdown family uses `shadow.overlay`; `Box`'s `boxShadow` prop is typed to the `shadow.level` namespace (`types.ts`), so the surface takes `shadow.level.1` — the same 8px blur and 0.25 alpha, but 1px of y-offset instead of 4px and a darker navy instead of a light periwinkle. Closing the gap means widening `Box.boxShadow` to the whole `shadow` namespace, which is a change to a shipped primitive and belongs in its own PR. Until then this is the one place a popover doesn't sit exactly on top of a menu. Realigning is otherwise cheap: the surface is a `Box`, so it's a prop change rather than a stylesheet change.

### Prior Art

- **[React Aria `Popover`](https://react-spectrum.adobe.com/react-aria/Popover.html)** — the foundation. See the decision record for why the components rather than the hooks.
- **[Untitled UI](https://www.untitledui.com/)** — the visual reference for the header/body/footer rhythm and the rich-row treatment.
- **`src/Modal/`** — the slot vocabulary (`Header`/`Title`/`Body`/`Footer`) and `useModalTrigger()`, which `usePopoverTrigger()` mirrors exactly. Only the modern slot half is copied; `ModalHeader`'s `layout="title"` and `ModalFooter`'s `primaryAction` exist for back-compat and are not reproduced.
- **`src/Menu/`** — the clone-child trigger. `MenuTrigger` merges the child's own props rather than overwriting them, which `ModalTrigger` and `DrawerTrigger` do not; `PopoverTrigger` follows `Menu`.
- **`src/DatePicker/DatePickerOverlay.tsx`** — the closest existing structure, and the furthest existing surface: `border_radius.lg`, `shadow.modal`, no border. Its `.dialog` rule was the starting point structurally, but the surface went to the dropdown family instead. Its `pointer-events: auto; position: relative; z-index: 1` are vestigial in both files — React Aria's underlay is a preceding sibling, so nothing needs lifting above it.
- **`src/Box/`** — the container. `Popover.Overlay` accepts `BoxStyleProps`, which is what lets a popover depart from the default surface without a new component or a `className` escape hatch.

---

## Design

### API

```tsx
<Popover>                  {/* useOverlayTriggerState + useOverlayTrigger + both contexts */}
  <Popover.Trigger>        {/* the one attachment point: clones any focusable child */}
  <Popover.Overlay>        {/* RAC <Popover> + <Box> + RAC <Dialog> */}
    <Popover.Header>       {/* pinned; hosts Popover.Title */}
      <Popover.Title>      {/* carries the aria-labelledby id */}
    <Popover.Body>         {/* the only scrolling region */}
    <Popover.Footer>       {/* pinned action row */}
```

```ts
type PopoverProps = {
  children: ReactNode;
  defaultOpen?: boolean;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
};

type PopoverTriggerProps = {
  children: ReactElement;
};

// Everything Box styles, minus the two whose popover meanings take precedence.
type PopoverContainerStyleProps = Omit<BoxStyleProps, "maxHeight" | "width">;

type PopoverOverlayProps = PopoverContainerStyleProps & {
  children: ReactNode;
  "aria-label"?: string;
  containerPadding?: number; // 12
  crossOffset?: number; // 0
  isKeyboardDismissDisabled?: boolean; // false
  maxHeight?: number;
  offset?: number; // 8
  placement?: Placement; // "bottom start"
  shouldFlip?: boolean; // true
  width?: PopoverWidth; // "fit-content"
};

type PopoverWidth =
  "fit-content" | "auto" | "trigger" | ResponsiveProp<string | number>;

type PopoverHeaderProps = { children: ReactNode };
type PopoverTitleProps = Omit<TextProps, "id">;
type PopoverBodyProps = { children: ReactNode };
type PopoverFooterProps = { children: ReactNode };

function usePopoverTrigger(): OverlayTriggerState;
```

Two deliberate deviations from `Menu`: `placement` defaults to `"bottom start"`, because a content-width panel centered on a narrow trigger looks wrong; and `width` defaults to `"fit-content"`, because rich content is content-sized.

`width` has one mode `Menu` doesn't. `auto` is `Menu`'s: the trigger's measured width as a `min-width` floor, so the popover is never narrower than its trigger but grows for wider content. For a popover, content wider than the trigger is the normal case, which makes `auto` and `fit-content` render identically more often than not — so `trigger` uses the same measurement as a hard width, for designs 3 and 4, where the panel has to line up with its trigger exactly. Both read `--trigger-width`; only which property they assign it to differs.

`defaultOpen` / `isOpen` / `onOpenChange` go to `useOverlayTriggerState` in `Popover` and are **not** forwarded to React Aria Components' `Popover`. Forwarding them would make it prefer its own local state and split the source of truth.

#### The container takes Box's style props

The surface is a `Box`, and the props left over after `Popover.Overlay` takes its own become that `Box`'s. Defaults are spread first, so a consumer's win. This is deliberately the whole of `BoxStyleProps` rather than a curated subset: `Box` is already the sanctioned way to express a one-off surface, and the alternative — a `className` escape hatch or a second component — is worse. `BoxProps`' HTML-attribute half is **not** included; it would put `onClick`, `role`, and `id` on the overlay's surface, where they'd be read as the dialog's.

Two names collide, and the popover keeps both:

- **`width`** — `PopoverWidth` rather than `Dimension`, because `"auto"` means the trigger's width. It also lands on the positioned element rather than the container, since that's what React Aria measures.
- **`maxHeight`** — `number` rather than `Dimension`, because it's a positioning input handed to `usePopover`, not only a CSS declaration.

Padding is the one prop worth a warning: the slots own their padding through `--ezui-c-popover-padding-x/y`, so `padding` on the container insets the whole stack on top of that. That's why the vertical padding lives on the slots rather than the container — the scrolling body has to run edge to edge so content doesn't clip against a container inset while it scrolls.

#### Props deliberately omitted

- **`isNonModal`** — it would be a lie. `useDialog` calls `useOverlayFocusContain()` unconditionally, so a nested `Dialog` force-contains focus regardless of the flag. And `usePopover` sets `isDismissable: !isNonModal`, so a non-modal popover also stops dismissing on outside press, and React Aria Components drops the underlay and both `DismissButton`s. Doing it properly means dropping the `Dialog` and re-deriving `ModalUnderlay`. The combobox-shaped case is already served by `MultiSelect`.
- **`isDisabled`** — redundant. An Easy UI `<Button isDisabled>` never fires `onPress`, so disabling the trigger disables the popover.
- **An arrow or tip** — no existing popover has one and no design shows one. React Aria Components' `OverlayArrow` is there if this is revisited.
- **`Popover.CloseButton`** — no design has an X, and `usePopoverTrigger().close()` covers footer buttons.
- **Entry and exit motion** — free from React Aria Components' `data-entering`/`data-exiting`, but no motion is specified. One CSS rule when it is.
- **`className` / `style`** — per `.github/CONTRIBUTING.md`.

### Example Usage

```tsx
// Simple
<Popover>
  <Popover.Trigger>
    <DropdownButton>Filters</DropdownButton>
  </Popover.Trigger>
  <Popover.Overlay aria-label="Filters">Content</Popover.Overlay>
</Popover>

// A field-shaped trigger opening a form — designs 1 and 2
<Popover>
  <Popover.Trigger>
    <SelectButton iconAtStart={PackageIcon}>Add Packaging</SelectButton>
  </Popover.Trigger>
  <Popover.Overlay width={400}>
    <Popover.Header>
      <HorizontalStack align="space-between" blockAlign="center" gap="2">
        <Popover.Title>Shipment Packaging</Popover.Title>
        <UnitToggles />
      </HorizontalStack>
    </Popover.Header>
    <Popover.Body>
      <Select label="Package" placeholder="Select a package">…</Select>
      <TextField label="Total Weight" placeholder="0.0" />
    </Popover.Body>
    <Popover.Footer>
      <DismissButton>Packaging Complete</DismissButton>
    </Popover.Footer>
  </Popover.Overlay>
</Popover>

// Trigger-width rows with a pinned footer link — design 3
<Popover.Overlay width="trigger" maxHeight={280}>
  <Popover.Header>
    <Popover.Title>Select Rate</Popover.Title>
  </Popover.Header>
  <Popover.Body>{rates.map((rate) => <RateRow key={rate.id} {...rate} />)}</Popover.Body>
  <Popover.Footer>
    <Button variant="link" onPress={viewMore}>View 10 More</Button>
  </Popover.Footer>
</Popover.Overlay>

// Closing from inside
function DismissButton({ children }) {
  const { close } = usePopoverTrigger();
  return <Button onPress={close}>{children}</Button>;
}
```

### Anatomy

- **`Popover`** — no DOM. Builds the open state and the trigger props, and publishes them on two contexts: its own, and React Aria Components' `OverlayTriggerStateContext`, which is what makes its `Popover` adopt this state instead of building its own.
- **`Popover.Trigger`** — no DOM. Clones its single child with `mergeProps(triggerProps, children.props)` and the trigger ref.
- **`Popover.Overlay`** — three nested elements: React Aria Components' `Popover` (positioned, and where the width custom properties land), a `Box` (the visual surface), and its `Dialog` (the role and the accessible name). Mints the title id, warns in development when the popover opens with no accessible name, and hands `Popover.Body`'s ref down as `scrollRef`. The extra layer is free: React Aria finds the dialog with a descendant query, not a child one.
- **`Popover.Header` / `Popover.Body` / `Popover.Footer`** — one `div` each. `Body` additionally attaches `useScrollbar` for the overlay scrollbar theme.
- **`Popover.Title`** — a `Text` with the title id applied last, so it can't be overwritten.

Header and Footer earn their place beyond scroll containment. They **pin**, which is what keeps "View 10 More" and "Packaging Complete" reachable while rows scroll. They carry the **a11y wiring**, so a consumer doesn't have to remember `aria-label`. They own the **padding tokens**, so every popover shares one rhythm rather than each call site hand-rolling spacing — the three divergent existing surfaces are what that looks like otherwise. And they're **optional**: plain children inside `Popover.Overlay` still work, and the stylesheet gives that case its own padding.

### DOM Structure

```html
<!-- The trigger, in place -->
<button
  aria-haspopup="dialog"
  aria-expanded="true"
  aria-controls="react-aria-1"
>
  Add Packaging
</button>

<!-- Portaled, at the end of <body> -->
<div data-testid="underlay" style="position: fixed; inset: 0"></div>
<div
  class="_popover_1a2b3c"
  data-placement="bottom"
  data-trigger="…"
  style="
    position: absolute;
    top: 40px;
    left: 0;
    max-height: 280px;
    --trigger-width: 320px;
    --ezui-c-popover-width-xs: var(--trigger-width);
    /* `width="auto"` would set --ezui-c-popover-min-width instead */
  "
>
  <!-- React Aria's DismissButton, for screen reader rotors -->
  <button aria-label="Dismiss" style="…visually hidden…"></button>

  <!-- The surface: a Box, so it carries Box's custom properties -->
  <div
    class="_Box_p7q8r9"
    style="
      --ezui-c-box-background-xs: var(--ezui-color-neutral-000);
      --ezui-c-box-border-color: var(--ezui-color-neutral-300);
      --ezui-c-box-border-top-left-radius-xs: var(--ezui-shape-border-radius-md);
      --ezui-c-box-box-shadow: var(--ezui-shadow-level-1);
      …
    "
  >
    <div
      id="react-aria-1"
      role="dialog"
      aria-labelledby="react-aria-2"
      tabindex="-1"
      class="_dialog_4d5e6f"
    >
      <div class="_header_7g8h9i">
        <h2 id="react-aria-2" class="…Text…">Select Rate</h2>
      </div>
      <div class="_body_j1k2l3" data-overlayscrollbars-initialize>…</div>
      <div class="_footer_m4n5o6">…</div>
    </div>
  </div>

  <button aria-label="Dismiss" style="…visually hidden…"></button>
</div>
```

Four details in there are load-bearing:

- **`aria-label` and `aria-labelledby` go on the `Dialog`, not on the positioned element.** React Aria Components would otherwise label a roleless `div`.
- **`id` on the `Dialog` comes from `useOverlayTrigger`'s `overlayProps`**, and is required: React Aria Components drops `props.id` from the positioned element when `isDialog` is false, so without this the trigger's `aria-controls` would point at nothing.
- **`data-testid="underlay"`** is React Aria Components'. `vite-plugin-react-remove-attributes` strips `data-testid` from production builds, so tests must not depend on it; they click `document.body` for outside-press instead.
- **The `Box` sits between the two, not around them.** The width custom properties have to be on the positioned element, because that's what React Aria measures and what `--trigger-width` is relative to; the role and accessible name have to be on the `Dialog`. The container is the layer in between with neither job, which is why it can be handed to the consumer.

The positioned element's `position`, `top`, `left`, and — near a viewport edge — `max-height` are written inline by React Aria. The stylesheet only adds the flex column and the width custom properties.

### Only the body scrolls

Under `maxHeight`, or in a viewport-constrained popover where `usePopover` writes `max-height` inline, the header and footer stay pinned and the body scrolls between them. That requires a `min-height: 0` chain through `.popover → the container → .dialog → .body`, with `overflow: hidden` on the container so a scrolled body can't paint over the rounded corners. Without the chain, flex children refuse to shrink below their content and nothing scrolls at all. The container's links in that chain (`display="flex"`, `flexDirection="column"`, `flex="auto"`, `minHeight={0}`, `overflow="hidden"`) are ordinary defaults, so a consumer who overrides one of them gives the scrolling up — the same trade any style escape hatch carries.

`Popover.Body` is also the `scrollRef` handed to React Aria Components — so the popover repositions with the scroll rather than closing — and the `useScrollbar` target, so its scrollbar matches `Menu` and `Select`.

Because it scrolls, the body also has to own the last 4px of its gap with the header and with the footer. `overflow` clips at the padding box, and a focused field paints `shadow.input` 3px outside its border box, so a field at the top or bottom of the body would have its focus ring sliced off if the whole gap sat on the header and the footer. The two halves — `space.1.5` on the region, `space.0.5` inside the body — add back up to the `space.2` that surrounds the surface. `Modal` reaches the same place from the other direction, with a padded content wrapper inside an unpadded scroll container.

---

## Behavior

### States and Interactions

Open and closed, from `useOverlayTriggerState`, controlled or uncontrolled. Opens on the trigger's press; closes on escape, on an outside press, or from `usePopoverTrigger().close()`.

Two behaviors are worth stating precisely, because both surprised the implementation:

_A `Popover` is aria-modal in effect._ `usePopover` runs `ariaHideOutside`, so while the popover is open the rest of the page — including an enclosing `Modal` — leaves the accessibility tree. This matches `Menu` and `Select`, and it means a test can't re-query an ancestor dialog by role while a popover is up.

_Moving focus out of the popover closes it._ `usePopover` hardcodes `shouldCloseOnBlur: true`. Containment means keyboard focus can't leave on its own, so there's no surprise close in practice — but a programmatic `.focus()` on an outside element does dismiss the popover, which is why the containment test tabs rather than focusing directly.

### Accessibility

The overlay is a `role="dialog"` and **needs an accessible name.** A `Popover.Title` supplies it; failing that, `aria-label` on `Popover.Overlay` does. If a popover opens with neither, Easy UI warns in development.

The title id is minted with `useId()` rather than `useSlotId()`. `useSlotId()` resolves to `undefined` for the render in which the labelling element isn't in the DOM yet — which is every render where the popover opens — and React Aria warns about the unlabeled dialog during that render. Handing over an id unconditionally keeps both libraries quiet, and the development warning is what catches a genuinely unlabeled popover. Passing an `aria-labelledby` that points at nothing is safe: the accessible name computation falls through to `aria-label`, which a test locks down.

#### Keyboard Navigation and Focus

- **Tab / Shift+Tab** move within the popover only. Focus is contained, via the indirect `Dialog` → `useDialog` → `useOverlayFocusContain` → `Overlay` `FocusScope` chain described in Risks.
- **Escape** closes the popover. `usePopover`'s key handler sits on the positioned element containing the dialog, so a keydown from any focused field inside bubbles to it. `isKeyboardDismissDisabled` suppresses it.
- **An outside press** closes the popover. React Aria Components passes its container as `groupRef`, so the whole portal group counts as inside.
- **Only the topmost overlay** responds to escape or an outside press, from `useOverlay`'s module-level `visibleOverlays` stack. That's what makes a `Select` inside a `Popover` inside a `Modal` dismiss one layer at a time.
- **Focus returns to the trigger** on close, from the same `FocusScope`'s `restoreFocus`.
- **Initial focus lands on the dialog container** (`tabIndex="-1"`), so a form's first field is one Tab away. To open directly onto a field, the consumer puts `autoFocus` on it — the `FocusScope` has no `autoFocus`, so a child's own wins.
- **Focus delegation:** yes, on the trigger. `Popover.Trigger` puts its ref on the child, and the child must land that ref on a focusable element.

### Security

None. `Popover` renders no HTML from strings. The only value interpolated into CSS is `width`, written to a custom property, which cannot break out of its declaration.

### Performance

Building on React Aria Components rather than the hooks removes the measurement pass the other overlays need. `MenuOverlay` and `SelectOverlay` measure the trigger with `useTriggerWidth` and gate their first render on `triggerWidth === null`, dropping a commit. React Aria Components computes `--trigger-width` itself with its own `ResizeObserver`, writing it in a layout effect, so a trigger-relative width lands on the first paint. One caveat: setting `--trigger-width` in `style` makes React Aria Components skip its own observer, so `getPopoverWidthStyles` must not.

Rows inside `Popover.Body` are not virtualized. Nothing in the designs is long enough to need it, and a virtualized region inside a contained focus scope has its own problems.

## Dependencies

No new packages. `react-aria-components` is already a direct dependency at `^1.20.0` and is imported by eight other component directories.

What the component reuses rather than extracting:

- `OVERLAY_PADDING_FROM_CONTAINER` from `../Menu/utilities` — generic overlay geometry that lives in `Menu/` only because `Menu` was the first overlay to need it. `Select`, `DatePicker`, and `MultiSelect` cross-import it the same way.
- `useScrollbar` from `../utilities/useScrollbar`.
- `getComponentToken`, `getResponsiveValue`, `sanitizeCustomProperties`, and `ResponsiveProp` from `../utilities/css`.

The version coupling is on documented public API — `triggerRef`, `scrollRef`, `maxHeight`, `className`, `style`, `OverlayTriggerStateContext` — plus one documented behavior, that nesting a `[role=dialog]` suppresses React Aria Components' own role.

### Platform Requirements

CSS custom properties and `:has()`, both already required across Easy UI. The `:has()` use is the padding fallback for content handed straight to the overlay with no slot to own it.

---

## `SelectButton`

The designs' triggers are select-shaped fields. That visual existed at `src/Select/SelectTrigger.tsx` but was unreachable: `Select/index.ts` exported only `./Select`, and `SelectTrigger` read `useInternalSelectContext()`. Meanwhile the same visual is independently re-copied in `MultiSelect` and `DatePicker`, and hand-rolled in `ForgeLayoutControls.module.scss`.

So the visual is extracted into a public presentational component and the internal trigger renders it:

- **`src/Select/SelectButton.tsx`** — `forwardRef`, presentational, no context. Rest props spread onto the inner `UnstyledButton`, so a cloned `onPress` / `aria-expanded` / `aria-controls` reach the real `<button>` while the wrapper `div` only positions the icons. They spread **before** `className`, following `Button`, so a cloned `className` can't clobber the field styling — `DropdownButton`, `IconButton`, and `KebabButton` do the opposite, and that's not inherited here. No `href`: a field-shaped trigger is not a link.
- **`src/Select/SelectTrigger.tsx`** shrinks to context plumbing with no visual code.
- **`description`** consolidates here. `SelectField` hand-composed the two-line descriptive mode; the secondary line is now `SelectButton`'s `description` prop. `SelectField` keeps its own `variant` switch on the primary line and its placeholder styling, which is why `SelectButton` does not wrap `children` in `Text`.
- **`src/Select/index.ts`** gains one line. No new subpath: consumers write `import { SelectButton } from "@easypost/easy-ui/Select"`.
- **`Select.module.scss`** classes stay where they are and are consumed by `SelectButton`. Nothing moves between files.

`SummaryCard`, design 4's two-line bordered card trigger, is **not** shipped. It lives in `Popover.stories.tsx` as a copyable `forwardRef` example, with a comment spelling out the two things a custom trigger owes `Popover.Trigger`. `<SelectButton description="…">` is the no-custom-component alternative when a field-shaped border and a chevron are acceptable.

---

## Deferred

- **`isNonModal`**, if a combobox-shaped popover is ever needed outside `MultiSelect`. The recipe is `ModalUnderlay`'s: drop the `Dialog`, render `<Overlay disableFocusManagement>` with an explicit `FocusScope`.
- **An arrow or tip**, via React Aria Components' `OverlayArrow`.
- **Entry and exit motion**, via `data-entering` / `data-exiting`. `Drawer` had to pull in `react-transition-group` for the equivalent; this needs one CSS rule.
- **Promoting `SummaryCard`** out of the story file, once a second consumer wants it.
- **Aligning `MenuOverlay`, `SelectOverlay`, and `DatePickerOverlay` to the same surface tokens.** They disagree with each other and now with `Popover` too, but each change is visible in a shipped component and wants its own review.
- **An image or thumbnail component.** There is no `Avatar`/`Image`/`Thumbnail` in the library, so the `Items` story renders its product photos as `<Box as="img">`.
- **A `Link` component.** `Text`'s `as` union excludes `"a"`, so SKU links in the stories are `<Button variant="link">`.
- **Pointing `MultiSelect`, `DatePicker`, and `ForgeLayoutControls` at `SelectButton`**, which removes the three remaining copies of the field visual but changes pixels in shipped components.
- **Refactoring `ForgeLayoutModeSwitcher` onto `Popover`**, which would delete `crossOffset={116}`, its React Aria Components imports, and its missing-accessible-name bug.
- **Extracting the generic overlay constants, `useTriggerWidth`, and `.underlay` out of `Menu/`** and rewriting the four files that cross-import them.
- **Refactoring `MenuOverlay` / `SelectOverlay` / `DatePickerOverlay` to render through `Popover`.** Distinct a11y roles and `MenuOverlay`'s select-all machinery mean no user-facing gain.

---

## Resources

- [React Aria `Popover`](https://react-spectrum.adobe.com/react-aria/Popover.html)
- [React Aria `Dialog`](https://react-spectrum.adobe.com/react-aria/Dialog.html)
- [WAI-ARIA `dialog` role](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [Easy UI decision 014: react-aria-components for new overlays](../decisions/014_react_aria_components_for_overlays.md)
- [Easy UI decision 011: support UnstyledButton component](../decisions/011_unstyled_button.md)
</content>

</invoke>
