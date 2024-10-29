# `Spinner` Component Specification

## Overview

A `Spinner` component indicate the loading state of a component or page.

### Use Cases

- Use a `Spinner` component to display a visible loading indicator for situations when an asynchronous API call or process might take a while.

### Features

- Supports `sm`, `md` and `lg` sizes.
- Supports optional label.
- Supports various colors.
- Supports both determinate and indeterminate states.
- It's animated.

### Prior Art

- [Paste `<Spinner />`](https://paste.twilio.design/components/spinner)
- [React Aria `useProgressBar`](https://react-spectrum.adobe.com/react-aria/useProgressBar.html)

---

## Design

### API

```ts
export type ProgressProps = {
  /**
   * Mark the `Spinner` as indeterminate when progress is
   * unknown.
   */
  isIndeterminate: true;
  /**
   * The current progress
   */
  value?: undefined;
};

export type IndeterminateProps = {
  /**
   * Mark the `Spinner` as indeterminate when progress is
   * unknown.
   */
  isIndeterminate?: false;
  /**
   * The current progress
   */
  value: IntRange<0, 100>;
};

type SpinnerProps = (ProgressProps | IndeterminateProps) & {
  /**
   * Size of spinner.
   * @default md
   */
  size?: "sm" | "md" | "xl";
  /**
   * The label for spinner.
   */
  children?: ReactNode;
  /**
   * Adjust color of spinner and label.
   * @default "neutral.500"
   */
  color?: ThemeColorAliases;
};
```

### Example Usage

```tsx
import { Spinner } from "@easypost/easy-ui/Spinner";

function Component() {
  return <Spinner isIndeterminate>Loading...</Spinner>;
}
```

_Progress:_

```tsx
import { Spinner } from "@easypost/easy-ui/Spinner";

function Component() {
  return <Spinner value={50}>Loading...</Spinner>;
}
```

_Sizing:_

```tsx
import { Spinner } from "@easypost/easy-ui/Spinner";

function Component() {
  return (
    <Spinner size="xl" isIndeterminate>
      Loading...
    </Spinner>
  );
}
```

_Color:_

```tsx
import { Spinner } from "@easypost/easy-ui/Spinner";

function Component() {
  return <Spinner color="primary.500" isIndeterminate />;
}
```

### Anatomy

```tsx
export function Spinner(props: SpinnerProps) {
  const {
    children,
    size = "md",
    color = "neutral.500",
    isIndeterminate = false,
    value,
  } = props;
  const { progressBarProps, labelProps } = useProgressBar({
    ...props,
    label: children,
  });
  const id = useId();
  const degrees = !isIndeterminate && value && (value * 360) / 100;
  const style = {
    ...getComponentThemeToken("spinner", "background", "color", color),
    ...getResponsiveDesignToken("spinner", "size", "size.icon", size),
    ...(degrees && {
      ...getComponentToken("spinner", "degrees", `${degrees}deg`),
    }),
  } as React.CSSProperties;
  return (
    <div
      {...progressBarProps}
      className={styles.spinner}
      style={style}
      role={isIndeterminate ? "status" : progressBarProps.role}
      aria-labelledby={progressBarProps["aria-labelledby"] ?? id}
    >
      <div
        className={classNames(
          isIndeterminate ? styles.spinnerIntermediate : styles.spinnerProgress,
        )}
      />
      <Text {...labelProps} id={labelProps.id ?? id} visuallyHidden={!children}>
        {children ? children : "Loading"}
      </Text>
    </div>
  );
}
```

---

## Behavior

### Accessibility

- Spinner has the `role="status"` attribute when progress is unknown, and it has the `role="progressbar"` attribute when progress is known.

- Spinner accessibility is handled by `useProgressBar` from React Aria.

### Dependencies

There are no major dependencies to highlight for this component
