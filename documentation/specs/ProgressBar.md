# `ProgressBar` Component Specification

## Overview

A `ProgressBar` shows how far along a task with a known end is.

### Use Cases

- Showing progress on work with a measurable total: uploading a file, buying a batch of labels, working through a multi-step import.
- Showing usage against a limit, such as a monthly label quota.
- Rendering the progress in each `<ActivityTray.Task />` row. This is where the component came from: it was extracted from the tray's private progress bar so the two stay identical.

### Features

- Determinate only. When progress is unknown, use `<Spinner isIndeterminate />`.
- Optional visible label, or `aria-label` / `aria-labelledby` when the bar's subject is already on screen.
- A value label that is both the visible text and `aria-valuetext`. It defaults to a formatted percentage, and `valueLabel` or `formatOptions` can replace it.
- Theme colors for the fill.
- Fill eases between values over 150ms. The transition is off under `prefers-reduced-motion`.

### Prior Art

- [React Aria `useProgressBar`](https://react-spectrum.adobe.com/react-aria/useProgressBar.html)
- [Paste `<ProgressBar />`](https://paste.twilio.design/components/progress-bar)
- `src/ActivityTray/ActivityTrayProgress.tsx`, the private bar this replaces. The track and fill tokens are carried over unchanged.

---

## Design

`ProgressBar` has no indeterminate mode. A linear indeterminate animation needs its own design, and `Spinner` already covers unknown progress. A bar that shows a made-up percentage reads worse than a spinner that makes no claim.

The label uses `body2`, which is `InputField`'s label size for compact fields. The value label is `caption` in `neutral.600` with tabular numerals, so it doesn't jitter as it counts. The track is `space.0.5` tall with `shape.border_radius.sm` corners, filled `color.neutral.100`.

### API

```ts
export type ProgressBarProps = {
  /** The current value. Clamped to `minValue` and `maxValue`. */
  value: number;
  /**
   * The value the bar starts from.
   * @default 0
   */
  minValue?: number;
  /**
   * The value that fills the bar.
   * @default 100
   */
  maxValue?: number;
  /**
   * A visible label, rendered above the bar. Without one, name the bar with
   * `aria-label` or `aria-labelledby`.
   */
  label?: ReactNode;
  /**
   * Human-readable text for the current value, e.g. "127 of 250 labels". It's
   * both what's shown beside the label and what a screen reader reads as
   * `aria-valuetext`. Defaults to the value formatted as a percentage.
   */
  valueLabel?: ReactNode;
  /**
   * Whether to show the value label.
   * @default true when `label` is set, otherwise false
   */
  showValueLabel?: boolean;
  /**
   * How the default value label is formatted. Ignored when `valueLabel` is
   * set.
   * @default { style: "percent" }
   */
  formatOptions?: Intl.NumberFormatOptions;
  /**
   * Color of the filled portion of the bar.
   * @default "primary.500"
   */
  color?: ThemeColorAliases;
  /** Names the bar when there's no visible `label`. */
  "aria-label"?: string;
  /** Names the bar by another element's id when there's no visible `label`. */
  "aria-labelledby"?: string;
  /** Identifies the element (or elements) that describe the bar. */
  "aria-describedby"?: string;
};
```

### Example Usage

```tsx
import { ProgressBar } from "@easypost/easy-ui/ProgressBar";

function Component() {
  return (
    <ProgressBar
      label="Buying labels"
      value={127}
      maxValue={250}
      valueLabel="127 of 250 labels"
    />
  );
}
```

_Without a visible label:_

```tsx
<ProgressBar aria-label="Upload progress" value={40} />
```

### Anatomy

```tsx
<div
  role="progressbar"
  aria-valuenow
  aria-valuemin
  aria-valuemax
  aria-valuetext
>
  <div className={styles.header}>
    {" "}
    {/* only with a label or value label */}
    <Text variant="body2">{label}</Text>
    <Text variant="caption">{valueLabel}</Text>
  </div>
  <div className={styles.track}>
    <div className={styles.fill} />{" "}
    {/* width from --ezui-c-progress-bar-fill */}
  </div>
</div>
```

---

## Behavior

### Accessibility

- `useProgressBar` from React Aria handles all of the component's accessibility: `role="progressbar"`, the value attributes, and labelling.
- The bar needs an accessible name from `label`, `aria-label`, or `aria-labelledby`.
- Progress changes are not announced. If the outcome matters, the app should announce it when the work finishes; `ActivityTray` does this.

### Dependencies

There are no major dependencies to highlight for this component.
