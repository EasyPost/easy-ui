# `Box` Component Specification

## Overview

A `Box` is a general-purpose container that exposes Easy UI's design tokens as props. It exists to absorb styling that consuming applications otherwise have to write as one-off CSS modules and inline `style` objects.

### Use Cases

An audit of `easypost-web-app` found 93 `*.module.scss` files (~2,350 lines) and 125 non-story `style={{}}` usages. **55 of the 93 modules (59%) contain nothing but properties a `Box` can express.** The recurring blocks, in order of duplication:

| Block                                                     | Files |
| --------------------------------------------------------- | ----- |
| `object-fit` + fixed dimensions for carrier/partner logos | 13    |
| Ad-hoc dividers (a 1px rule with margins)                 | 10    |
| Verbatim `.cardButton { all: unset; … }`                  | 5     |
| Sticky banner                                             | 4     |
| `height: calc(100vh - 96px)` + flex column                | 4     |
| Literal Tailwind-style utility class dumps                | 3     |
| Field connector line                                      | 3     |
| Full-screen interstitial                                  | 3     |
| Absolutely centered spinner overlay                       | 2     |

Three of those files independently reinvented Tailwind. That is the signal: the application has no vocabulary for layout, so each team invents one.

Property frequency across those modules: `display` 119, `width` 98, `height` 71, `padding` 62, `position` 48, `max-width` 39, `flex-direction` 38, `flex` 34, `justify-content` 33, `background` 31, `align-items` 24, `min-width` 23, `margin` 23, `border-radius` 23, `top` 22, `object-fit` 22, `border` 22, `cursor` 16, `overflow` 15, `min-height` 12, `outline` 11, `z-index` 9, `pointer-events` 7. Inline styles: `padding` 43, `maxHeight` 24, `height` 23, `width` 22, `display` 15.

The specific gaps a `Box` closes, ranked by volume:

1. **A `Stack` child cannot control how it flexes.** `flex: 1` appears 32 times and `display: inline-flex` 36 times, purely to make a child behave inside a stack.
2. **No sizing vocabulary.** The constrained centered container (`width: 100%; max-width: N; margin: 0 auto`) appears 15 times, with max-widths of 575, 700, 800, 900, 1046, 1080, 1310, and 1320px. Viewport fill appears 13 times.
3. **No media primitive.** 22 `object-fit: contain` declarations across 13 files.
4. **No positioning escape.** 48 `position`, 22 `top`, 6 `inset`, 9 `z-index`, 7 `pointer-events`.
5. **`Card` cannot participate in layout.** It has `background`, `padding`, `borderRadius`, `boxShadow`, and `borderColor` but no `width` or `flex`, producing `.cardWrapper > :first-child { height: 100% }` reach-throughs in 3 places.
6. **`UnstyledButton` exists but goes unused.** `all: unset` appears 5 times and `@include unstyled.button` 9 times.
7. **Reaching into Easy UI internals.** 13 `:global(.epr-*)` selectors, plus `div[role="dialog"]` and `[data-overlayscrollbars="host"]`. Only 3 of 63 components accept `className`.

### Features

- **Token-constrained where a scale exists, free where none does.** This is the organizing rule of the API.
- Space, color, border, and shadow properties are typed to their token scales, so an invalid value is a compile error.
- Sizing and positioning accept free CSS values, because Easy UI has no size token scale.
- Property cascades: a specific side beats an axis beats a shorthand (`paddingTop` > `paddingY` > `padding`).
- Border style is inferred, not exposed — a border color or width implies `solid`.
- `as` renders any element, and `button`, `a`, `ul`, `ol`, `fieldset`, and `legend` get an automatic unstyled reset.
- Flexbox and CSS Grid are supported to the same depth, on both sides: a `Box` can be a container of either, and can place itself inside either.
- Most properties are responsive per breakpoint via Easy UI's existing responsive-prop mechanism.
- No `className`, no `style`.

### Known Limitations

A second sweep of `easypost-web-app` widened the audit to the legacy layer: 97 `*.module.scss` files, 238 non-module `.scss` files (~150 of them aggregated into `main.scss` by `@import` chains), and 80 inline `style={{}}` objects across 61 files. There is no CSS-in-JS anywhere in the app.

The coverage holds up at that scale. **768 of 1,471 leaf declaration blocks (52%)** in the legacy stylesheets contain only properties a `Box` can express, as do **152 of 199 (76%)** simple class rules in the CSS modules. The recurring inline-style shapes are also expressible: image sizing with `width` + `height` + `aspectRatio` (22 of the 80), a fixed-height spacer `<div>` (8), and a single-purpose margin or padding wrapper (12) — every `rem` and `px` value in that last group lands exactly on a space token, since the scale is built on 8px multiples.

What a `Box` cannot absorb is narrow, specific, and mostly by design:

| Gap                                                   | Occurrences                                                 | Nature                                                            |
| ----------------------------------------------------- | ----------------------------------------------------------- | ----------------------------------------------------------------- |
| `opacity: 0 \| 1` crossfade                           | 6 inline styles                                             | Token gap — the scale has one alias, `underlay` (`0.4`)           |
| Pseudo-classes and `transition`                       | 44 files `:hover`, 25 `transition` (only 5 are CSS modules) | By design — a style prop styles one resting state                 |
| Pseudo-elements (`::before` icon rails)               | 3 modules                                                   | By design                                                         |
| `text-decoration`                                     | 4 inline styles + 2 modules                                 | By design — type styling, not layout; see below                   |
| Keyframe animation                                    | 4 files                                                     | By design — a style prop declares one state, not a sequence       |
| Descendant, child, and `:global()` selectors          | 12 `:global()` blocks                                       | By design — a `Box` styles only itself                            |
| Computed, non-token colors                            | 2 inline styles                                             | By design — `background`/`color`/`borderColor` take a theme alias |
| Custom breakpoints (768px, 992px, 1300px)             | 2 modules                                                   | Token gap — responsive props are keyed to the token scale         |
| `scroll-margin-top`, `font-family`, background images | 1 each                                                      | Prop omission                                                     |

Two of these are worth restating because they read like Box gaps and are not. **Raw hex values that have a token are fine** — the app's `#fff` is `neutral.000` and its `#061340` is `primary.800`; only a value computed at runtime has no token to name. And **`box-shadow` has three levels** (`1`, `2`, `3`), so the hover-shadow pattern's resting state is expressible even though its hover is not.

Two gaps this audit found have since been closed. `transform` and `transformOrigin` are now responsive string props, and `overscrollBehavior` is a non-responsive three-value enum — the natural partner to `overflow`, since `Box` already owns scroll containment. Neither needs the `revert` fallback that `display`, `overflow`, and `text-align` need: an unset variable resolves each of them to `none`, `50% 50%`, and `auto`, which is what they already are by default. Together they cost 3,151 raw and 105 gzipped bytes in the built library stylesheet, nearly all of it the two responsive props. A responsive property is roughly four times the raw size of a non-responsive one, because it emits six custom-property declarations and five `@media` blocks rather than a single declaration; gzip absorbs most of that, since the boilerplate is near-identical across properties.

A third gap has since been closed, and it was a structural one rather than a missing declaration: `Box` could become a grid container but could not define tracks or place children, so grid was the one layout mode it supported at half the depth of flexbox. It now supports both to the same depth. Container-side that is `gridTemplateColumns`, `gridTemplateRows`, `gridTemplateAreas`, `gridAutoFlow`, `gridAutoColumns`, and `gridAutoRows`; child-side, `gridColumn`, `gridRow`, and `gridArea`. Three properties shared by both modes were added at the same time, since leaving them out would have made grid the better-served of the two: `justifyItems`, `justifySelf`, and `alignContent` — the last of which flexbox needs too, for a container whose children wrap.

Two implementation notes. `gridTemplateColumns` and `gridTemplateRows` reuse `HorizontalGrid`'s track formatter, which was moved to `utilities/grid` so that a primitive does not import from a higher-level component; `HorizontalGrid`'s public `Columns`, `ColumnsType`, and `ColumnsAlias` types are now aliases of the shared ones, and its API is unchanged. And `gridArea`, `gridColumn`, and `gridRow` are expanded in TypeScript into `grid-row-start`, `grid-row-end`, `grid-column-start`, and `grid-column-end` rather than declared as shorthands, for the same reason `flex` and `border-radius` are: three props writing the same four longhands means whichever shorthand came later, resolving to `unset`, would reset the placement its neighbour had just set. Expanding them also makes the cascade explicit — `gridColumn` and `gridRow` win over `gridArea` on the axis they name. The expansion follows CSS's own omitted-value rule, where an omitted end line is copied only if the start is a `<custom-ident>`, so `gridArea="sidebar"` spans the named area while `gridArea="1"` occupies one track.

Grid cost 21,283 raw and 1,105 gzipped bytes — thirteen responsive properties, seventy-eight `--ezui-c-box-*: initial` declarations. That is the largest single addition to `Box`'s CSS, and worth it only because grid is a layout mode rather than a decoration: no other property can be worked around by the caller, whereas most of what remains on the gap list can.

`HorizontalGrid` remains the right first reach for equal columns with a gap, exactly as `HorizontalStack` and `VerticalStack` are for flexbox. `Box`'s grid props are for the shapes those cannot express: uneven tracks, named areas, and a child that spans.

Of the nine remaining, one is worth closing, and only for reasons independent of how often the app hits it.

**`opacity` needs `0` and `1` aliases.** This is a tokens change, not a `Box` change: the prop exists and already emits its declaration, so two new aliases cost no additional CSS and cover every crossfade site. Paired with the existing `pointerEvents`, that yields the functional show/hide even though the fade itself needs a `transition` and will not happen.

**`textDecoration` stays out, and the boundary it draws is the reason.** `Box` is layout; type styling belongs to `Text`. A `<Box as="a">` should be an unstyled hit area, and anything that needs to _read_ as a link should use a text component. That rule can be applied without a judgment call at each site, which is worth more than the one property.

Recording the consequence rather than arguing with it: `as="a"` applies `unstyled.link`, which sets `text-decoration: none` unconditionally. `Text` has no decoration property either and Easy UI has no `Link` component, so as of today nothing in the library renders an underlined inline link, and `<Box as="a">` inside body copy is distinguishable from its surrounding text by color alone — a WCAG 1.4.1 concern. The boundary above does not create that gap, it relocates it: the fix belongs in `Text` or in a `Link` component, and is tracked there. Volume was never the argument either way — three of the four application sites merely strip an underline, which the reset already does for free.

The remaining eight should stay out, and in three cases the fix belongs somewhere else. Hover styling is an interactive `Card` variant, not a style prop — a `_hover={{ … }}` mechanism is the Primer and Chakra path this specification argues against, and it multiplies the stylesheet by every property allowed inside it. The `:global()` reach-throughs are a symptom of Easy UI components not accepting layout control; fixing those components removes the need, whereas a selector mechanism on `Box` would legitimize the reach-through. And the custom breakpoints are Bootstrap's 768/992, i.e. legacy rather than a requirement; a seventh breakpoint would add a `@media` block to every responsive property, roughly a sixth again of `Box`'s CSS.

Worth noting on the two that shipped: most of the application's `transform` uses did not need the prop. `translate(-50%, -50%)` centering is `inset="0"` with `marginX`/`marginY="auto"`, and `translateY(-48px)` is `marginTop="-6"` — both of which move the surrounding layout with the box, which is usually what was wanted. `transform` earns its place for the cases where the layout should _not_ respond, such as a scaled preview thumbnail.

### Risks and Challenges

**A general-purpose `Box` is the most-abused component in every design system that has one.** Three risks are worth naming.

_Runtime cost._ GitHub Primer is the cautionary tale. Its [ADR-005](https://github.com/primer/react/blob/main/contributor-docs/adrs/adr-005-recommend-sx-prop.md) made `Box` plus an `sx` prop the universal building block; [ADR-016](https://github.com/primer/react/blob/main/contributor-docs/adrs/adr-016-css-modules.md) superseded it in favor of CSS Modules, with benchmarks: rendering 1000 components went from 242ms to 96ms (60% faster); a real repository directory page went from 3800ms to 3076ms (20% faster); switching fixed styles to dynamic runtime styles cost 55% (242ms → 441ms); one `IconButton` in the PR diff view went from 400ms via `sx` to 165ms via a `.css` file (60% faster); SSR style collection added 20% (450ms of a 1900ms render). `packages/react/src/Box` no longer exists in Primer.

Easy UI is not exposed to this. It has no runtime CSS-in-JS: styles are static CSS Modules parameterized by CSS custom properties written to the `style` object. A `Box` here costs one object literal per render and no style injection, style recalculation, or SSR collection phase. **This risk is avoided by construction, and the implementation must not introduce a new styling mechanism to change that.**

_Stylesheet size._ The responsive-prop mixin emits one `--ezui-c-box-<prop>-<breakpoint>: initial` declaration per property per breakpoint, plus a `@media` block per property per breakpoint above `xs`. With 37 responsive properties across 6 breakpoints that is 222 initial declarations. Measured on the built library CSS: **230,117 → 285,022 bytes raw (+54,905, +23.9%); 31,997 → 35,893 bytes gzipped (+3,896, +12.2%)**. The unminified raw figure overstates the cost — the repetition is almost entirely `@media` boilerplate, which compresses. Keeping a property non-responsive is the lever if this needs to come down.

_Displacing named components._ A `Box` that can do everything invites `<Box display="flex" flexDirection="column" gap="2">` where `<VerticalStack gap="2">` reads better. Mitigation is documentation, not API: the docs point at `HorizontalStack`, `VerticalStack`, and `HorizontalGrid` first, and `display` is documented as the exception rather than the norm.

### Prior Art

Seven systems were read from primary source. The design borrows most from Polaris (mechanism) and Radix (value discrimination), and treats Primer as the constraint.

**[Shopify Polaris `Box`](https://github.com/Shopify/polaris/tree/main/polaris-react/src/components/Box)** — the closest architectural match. CSS Modules plus CSS custom properties; its `getResponsiveProps`, `sanitizeCustomProperties`, and `classNames` helpers are near-identical to Easy UI's `utilities/css.ts`, which is unsurprising since Easy UI's responsive-prop mixin is credited to Polaris. Notable choices: a curated container surface rather than every CSS property; a closed six-value `as` enum (`div | span | section | legend | ul | li`); logical padding with a `paddingBlockStart || paddingBlock || padding` cascade; free-form strings permitted only for `minHeight`, `minWidth`, `maxWidth`, `width`, `opacity`, and `zIndex`; **`borderStyle` inferred as `solid` whenever a border color or width is set** (likewise for outline); an automatic list reset when `as === 'ul'`. Polaris deliberately has no `margin`, no flexbox properties, and no `gap` — `Box` is a surface, and layout belongs to `InlineStack`/`BlockStack`.

**[Twilio Paste `Box`](https://github.com/twilio-labs/paste/tree/main/packages/paste-core/primitives/box)** — the maximal end. All of styled-system's prop groups plus `BoxPseudoStyleProps`, roughly 50 keys (`_hover`, `_active`, `_focus`, `_focusVisible`, `_disabled`, `_checked`, `_selected`, `_pressed`, `_invalid`, `_first`, `_last`, `_notFirst`, `_groupHover`, `_before`, `_after`, `_placeholder`, `__webkit_inner_spin_button`, …), credited to Chakra. `as?: keyof JSX.IntrinsicElements`, with HTML passthrough props re-declared and clashing `HTMLAttributes` keys omitted. Instructive for surface breadth; its runtime model (Emotion) is the one Primer measured and abandoned.

**[GitHub Primer](https://github.com/primer/react)** — see Risks above. Read as evidence, not as a model. The reversal is the strongest data point available on what a `Box` costs when it is backed by runtime styles.

**[Styled System](https://github.com/styled-system/styled-system/blob/master/docs/table.md)** — the origin of the prop-group vocabulary (space, color, layout, flexbox, border, position, shadow) that Paste, Chakra, and Rebass all inherit, and the origin of the theme-scale lookup with fall-through to raw values. Cite the GitHub repository, not `styled-system.com`; that domain has lapsed and now serves unrelated content.

**[Radix Themes `Box`](https://github.com/radix-ui/themes/tree/main/packages/radix-ui-themes/src/components/box.props.ts)** — the cleanest answer to "how do you accept both a token and an arbitrary value?" `box.props.tsx` itself is tiny (`as: 'div' | 'span'`, `asChild`, responsive `display`); the real surface lives in shared `props/*.props.ts` files composed into `layoutPropDefs`. The key mechanism is a prop-definition registry where a prop is declared `type: 'enum | string'` with `customProperties: ['--inset']`, so token values compile to static utility classes while arbitrary values fall through to a CSS variable. Also uses a signed scale (`-1` … `-9`) for negative space, and narrows `flexShrink`/`flexGrow` to `'0' | '1'`.

**[SEEK Braid `Box`](https://github.com/seek-oss/braid-design-system/tree/master/packages/braid-design-system/src/lib/components/Box)** — the strictest. `BoxBaseProps extends Omit<Atoms, 'reset' | 'background'>`: token-only, no escape hatch at all. Props are partitioned at runtime against a `sprinkles.properties` Set, so unknown props flow to the element and known ones to atoms. Uses `component?: ElementType` rather than `as`, and auto-applies an element-appropriate reset via `atoms({ reset: typeof component === 'string' ? component : 'div' })`, throwing in development if a reset is applied twice. Precedent for both the no-escape-hatch stance and the as-aware reset.

**[Atlassian Design System Primitives](https://atlassian.design/components/primitives/box/usage)** — describes `Box` as "a generic container that provides managed access to design tokens," and tiers its primitives: `Box`/`Inline`/`Stack` for common cases, `Flex`/`Grid`/`Bleed` for specifics, `Pressable`/`Anchor` for interaction. Its `XCSS` escape hatch is flagged "Caution" in its own documentation.

Where they agree: a curated property set rather than all of CSS; token scales as the value vocabulary; an `as`/`component` prop; named layout components (`Stack`, `Inline`, `Grid`) preferred over a raw `Box`; and an element-appropriate reset applied automatically.

Where they diverge, and what Easy UI does:

| Question                   | Divergence                                                  | Decision                                                                       |
| -------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Escape hatch               | Paste/Primer `sx`; Atlassian `xcss` (cautioned); Braid none | **None.** `Box` is the escape hatch.                                           |
| Layout properties on `Box` | Polaris excludes flexbox; Paste/Braid/Radix include it      | **Include**, with docs pointing at the named stacks first.                     |
| `margin`                   | Polaris excludes; everyone else includes                    | **Include**, with `auto` and negated tokens — 23 `margin` usages in the audit. |
| Arbitrary values           | Braid forbids; Radix allows via `type: 'enum \| string'`    | **Allow, but only where no token scale exists.**                               |
| `as` breadth               | Polaris 6-value enum; Paste any intrinsic element           | **Any `ElementType`**, with automatic resets for the 6 that need one.          |
| Negative space             | Radix signed scale `-1`…`-9`                                | **Negated alias strings** (`marginTop="-2"`), typed as `` `-${SpaceScale}` ``. |
| Pseudo-state props         | Paste ~50 `_hover`-style keys                               | **Out of scope.** Interaction states belong to named components.               |

---

## Design

### API

```ts
type Dimension = ResponsiveProp<number | string>;

type BoxProps = {
  as?: ElementType;
  children?: ReactNode;

  // Space — token, responsive
  padding?: ResponsiveSpaceScale;
  paddingX?: ResponsiveSpaceScale;
  paddingY?: ResponsiveSpaceScale;
  paddingTop?: ResponsiveSpaceScale;
  paddingRight?: ResponsiveSpaceScale;
  paddingBottom?: ResponsiveSpaceScale;
  paddingLeft?: ResponsiveSpaceScale;
  margin?: BoxMargin; // SpaceScale | `-${SpaceScale}` | "auto"
  marginX?: BoxMargin;
  marginY?: BoxMargin;
  marginTop?: BoxMargin;
  marginRight?: BoxMargin;
  marginBottom?: BoxMargin;
  marginLeft?: BoxMargin;

  // Size — free, responsive
  width?: Dimension;
  minWidth?: Dimension;
  maxWidth?: Dimension;
  height?: Dimension;
  minHeight?: Dimension;
  maxHeight?: Dimension;
  aspectRatio?: ResponsiveProp<string | number>;

  // Surface — token
  background?: ResponsiveProp<ThemeColorAliases>;
  color?: ThemeColorAliases;
  borderRadius?: BoxBorderRadius;
  borderRadiusTop?: BoxBorderRadius;
  borderRadiusBottom?: BoxBorderRadius;
  borderRadiusLeft?: BoxBorderRadius;
  borderRadiusRight?: BoxBorderRadius;
  borderRadiusTopLeft?: BoxBorderRadius;
  borderRadiusTopRight?: BoxBorderRadius;
  borderRadiusBottomRight?: BoxBorderRadius;
  borderRadiusBottomLeft?: BoxBorderRadius;
  borderColor?: ThemeColorAliases;
  borderWidth?: BorderWidth;
  borderTopWidth?: BorderWidth;
  borderRightWidth?: BorderWidth;
  borderBottomWidth?: BorderWidth;
  borderLeftWidth?: BorderWidth;
  boxShadow?: ShadowLevel;

  // Self in parent — flex and grid
  flex?: ResponsiveProp<BoxFlex>;
  flexGrow?: ResponsiveProp<number>;
  flexShrink?: ResponsiveProp<number>;
  flexBasis?: Dimension;
  alignSelf?: ResponsiveProp<BoxAlignSelf>;
  justifySelf?: ResponsiveProp<BoxJustifySelf>;
  order?: ResponsiveProp<number>;
  gridColumn?: BoxGridLine; // ResponsiveProp<string>
  gridRow?: BoxGridLine;
  gridArea?: BoxGridLine;

  // Children layout — flex and grid
  display?: ResponsiveProp<BoxDisplay>;
  flexDirection?: ResponsiveProp<BoxFlexDirection>;
  flexWrap?: ResponsiveProp<BoxFlexWrap>;
  justifyContent?: ResponsiveProp<BoxJustifyContent>;
  alignItems?: ResponsiveProp<BoxAlignItems>;
  justifyItems?: ResponsiveProp<BoxJustifyItems>;
  alignContent?: ResponsiveProp<BoxAlignContent>;
  gridTemplateColumns?: GridTracks; // number | string | (string | GridTrackAlias)[]
  gridTemplateRows?: GridTracks;
  gridTemplateAreas?: ResponsiveProp<string>;
  gridAutoFlow?: ResponsiveProp<BoxGridAutoFlow>;
  gridAutoColumns?: Dimension;
  gridAutoRows?: Dimension;
  gap?: ResponsiveSpaceScale;
  columnGap?: ResponsiveSpaceScale;
  rowGap?: ResponsiveSpaceScale;

  // Position
  position?: ResponsiveProp<BoxPosition>;
  inset?: BoxInset; // SpaceScale | number | string
  top?: BoxInset;
  right?: BoxInset;
  bottom?: BoxInset;
  left?: BoxInset;
  zIndex?: ZIndex;

  // Content behavior
  overflow?: ResponsiveProp<BoxOverflow>;
  overflowX?: ResponsiveProp<BoxOverflow>;
  overflowY?: ResponsiveProp<BoxOverflow>;
  overscrollBehavior?: BoxOverscrollBehavior;
  objectFit?: BoxObjectFit;
  textAlign?: ResponsiveProp<BoxTextAlign>;
  whiteSpace?: BoxWhiteSpace;

  // Transform — free, responsive
  transform?: ResponsiveProp<string>;
  transformOrigin?: ResponsiveProp<string>;

  // Interaction
  cursor?: BoxCursor;
  pointerEvents?: BoxPointerEvents;
  opacity?: Opacity;
} & Omit<
  AllHTMLAttributes<HTMLElement>,
  keyof BoxStyleProps | "as" | "children" | "className" | "style"
>;
```

Notes on the type:

- The HTML passthrough is `AllHTMLAttributes<HTMLElement>` rather than `ComponentPropsWithRef<"div">`, so `as="img"` with `src`/`alt` type-checks. Style props are omitted from it, so `width`, `height`, and `color` resolve to Box's definitions rather than the colliding HTML attributes.
- `className` and `style` are omitted from the type _and_ stripped at runtime.
- `Dimension` accepts `number` (treated as `px`) or `string` (passed through), covering percentages, viewport units, `calc()`, `fit-content`, and `auto`.

### Example Usage

```tsx
// Surface
<Box background="neutral.050" padding="4" borderRadius="lg">
  Content
</Box>

// Constrained, centered container — 15 occurrences in the audit
<Box width="100%" maxWidth={700} marginX="auto" padding="2">
  Content
</Box>

// Flexing within a stack — the highest-volume gap
<HorizontalStack gap="2">
  <Box flex="1">Fills the remaining space</Box>
  <Box>Natural width</Box>
</HorizontalStack>

// Centered overlay
<Box position="absolute" inset="0" display="flex" alignItems="center" justifyContent="center">
  <Spinner />
</Box>

// Logo — 22 object-fit declarations in the audit
<Box as="img" src={carrierLogo} alt="" width={80} height={40} objectFit="contain" />

// Unstyled button, with the reset applied automatically
<Box as="button" onClick={onSelect} padding="3" borderColor="neutral.200" borderRadius="md" cursor="pointer">
  <Text>Select</Text>
</Box>

// Responsive
<Box padding={{ xs: "2", md: "6" }} maxWidth={{ xs: "100%", lg: 480 }} />
```

### Anatomy

A single element. `Box` renders `as` (default `div`) with a generated `className` and a `style` object of `--ezui-c-box-*` custom properties. There are no subcomponents and no wrapper elements.

### DOM Structure

```html
<!-- <Box background="primary.100" padding="4" borderRadius="lg" /> -->
<div
  class="_Box_1a2b3c"
  style="
    --ezui-c-box-padding-top-xs: var(--ezui-space-4);
    --ezui-c-box-padding-right-xs: var(--ezui-space-4);
    --ezui-c-box-padding-bottom-xs: var(--ezui-space-4);
    --ezui-c-box-padding-left-xs: var(--ezui-space-4);
    --ezui-c-box-background-xs: var(--ezui-color-primary-100);
    --ezui-c-box-border-top-left-radius-xs: var(--ezui-shape-border-radius-lg);
    --ezui-c-box-border-top-right-radius-xs: var(--ezui-shape-border-radius-lg);
    --ezui-c-box-border-bottom-right-radius-xs: var(
      --ezui-shape-border-radius-lg
    );
    --ezui-c-box-border-bottom-left-radius-xs: var(
      --ezui-shape-border-radius-lg
    );
  "
></div>

<!-- <Box as="button" /> -->
<button class="_Box_1a2b3c _buttonReset_4d5e6f"></button>
```

---

## Behavior

### States and Interactions

`Box` is stateless. It has no interactions of its own; `as="button"` and `as="a"` inherit the element's native behavior, and the corresponding reset removes only appearance, never behavior or focus indication.

Three behaviors are worth stating precisely.

_Cascades._ For every property with axis and shorthand forms, the more specific value wins: `paddingTop ?? paddingY ?? padding`. Resolution uses `??`, not `||`, so `padding="0"` is honored. `inset` expands to all four edges and any individual edge overrides it; `overflow` expands to both axes; `gap` expands to both `columnGap` and `rowGap`.

_Border inference._ Following Polaris, there is no `borderStyle` prop. Setting `borderColor` or any border width implies `border-style: solid`. A `borderColor` on its own implies a border width of `1`, since CSS would otherwise render the color at its `medium` default.

_Longhands, not shorthands._ The stylesheet declares only longhand properties. This is a correctness requirement, not a style preference: a component token that is left unset resolves to `unset`, which resets its property to the initial value. A `flex-grow: unset` declaration sitting next to `flex: 1` would therefore reset `flex-grow` back to `0` and silently undo the shorthand. `Box` expands the `flex` shorthand into `flex-grow`/`flex-shrink`/`flex-basis` in JavaScript instead, and cascades border widths per side. For the same reason, border widths default to `0` in the stylesheet rather than being left unset, so a single-side border does not leave the other three at `medium`.

### Accessibility

`Box` is presentational and adds no semantics. Consumers choose semantics through `as` and standard ARIA attributes, which pass through.

Two accessibility considerations follow from `as`:

- The automatic resets must not remove focus indication. Easy UI's `styles/_unstyled` mixins do not touch `outline`, and `Box` exposes no `outline` prop, so focus rings survive. `Box` deliberately has no `outline` prop despite 11 occurrences in the audit, precisely so it cannot be used to remove one.
- `as="button"` yields a real `<button>`, so keyboard activation, focus order, and the accessibility tree are correct for free. This is the intended replacement for the 5 `all: unset` blocks, which are riskier because `all: unset` also strips focus styling.

#### Keyboard Navigation and Focus

None of its own. No focus delegation; a forwarded `ref` points at the rendered element.

### Security

None. `Box` renders no HTML from strings and interpolates no user input into CSS: every value is either a token alias mapped to a `var()` reference or a CSS length written to a custom property. Custom properties cannot break out of a declaration, so a hostile string cannot inject a new rule.

### Performance

Zero runtime styling cost by construction — see Risks above for the Primer benchmarks that make this the central design constraint. Per render, `Box` builds one object literal and one class string. There is no style injection, no serialization, no SSR style collection, and no dynamic stylesheet mutation.

The cost is paid statically in the stylesheet instead: +54,905 bytes raw and +3,896 bytes gzipped on the built library CSS, from 222 `--ezui-c-box-*: initial` declarations and their `@media` blocks. Properties that do not need to vary per breakpoint are declared non-responsive to hold this down: `color`, `borderColor`, all border widths, `boxShadow`, `zIndex`, `opacity`, `objectFit`, `whiteSpace`, `cursor`, and `pointerEvents`.

## Dependencies

None new. `Box` uses the existing `responsive-prop` mixin in `styles/_responsive-props.scss`, the existing helpers in `utilities/css.ts` (`getResponsiveDesignToken`, `getResponsiveValue`, `getComponentToken`, `getComponentDesignToken`, `getComponentThemeToken`, `sanitizeCustomProperties`, `classNames`), and the existing reset mixins in `styles/_unstyled.scss`.

Adding no new styling mechanism is deliberate: it is what keeps the Primer outcome off the table.

### Platform Requirements

CSS custom properties, already required across Easy UI. `aspect-ratio` and `inset` are used only when a consumer sets the corresponding prop.

---

## Resources

- [Shopify Polaris `Box`](https://github.com/Shopify/polaris/tree/main/polaris-react/src/components/Box)
- [Twilio Paste `Box`](https://github.com/twilio-labs/paste/tree/main/packages/paste-core/primitives/box)
- [Primer ADR-005: `sx` prop](https://github.com/primer/react/blob/main/contributor-docs/adrs/adr-005-recommend-sx-prop.md)
- [Primer ADR-016: CSS Modules](https://github.com/primer/react/blob/main/contributor-docs/adrs/adr-016-css-modules.md)
- [Styled System reference table](https://github.com/styled-system/styled-system/blob/master/docs/table.md)
- [Radix Themes prop definitions](https://github.com/radix-ui/themes/tree/main/packages/radix-ui-themes/src/props)
- [SEEK Braid `Box`](https://github.com/seek-oss/braid-design-system/tree/master/packages/braid-design-system/src/lib/components/Box)
- [Atlassian Primitives `Box`](https://atlassian.design/components/primitives/box/usage)
- [Easy UI decision 007: support responsive props](../decisions/007_support_responsive_props.md)
