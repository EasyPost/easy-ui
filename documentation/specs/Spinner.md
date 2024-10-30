# `Spinner` Component Specification

## Overview

A `Spinner` component indicate the loading state of a component or page.

### Use Cases

- Use a `Spinner` component to display a visible loading indicator for situations when an asynchronous API call or process might take a while.

### Features

- Supports `md` and `lg` sizes.
- Supports optional label.
- Supports various colors.
- It's animated.

### Prior Art

- [Paste `<Spinner />`](https://paste.twilio.design/components/spinner)

---

## Design

### API

```ts
type SpinnerProps = {
  /**
   * Size of spinner.
   * @default md
   */
  size?: "md" | "lg";
  /**
   * The label for spinner.
   */
  children?: string;
  /**
   * Adjust color of spinner and label.
   * @default "neutral.500"
   */
  color?: ThemeTokenNamespace<"color.text">;
};
```

### Example Usage

```tsx
import { Spinner } from "@easypost/easy-ui/Spinner";

function Component() {
  return <Spinner>Loading...</Spinner>;
}
```

_Sizing:_

```tsx
import { Spinner } from "@easypost/easy-ui/Spinner";

function Component() {
  return <Spinner size="lg">Loading...</Spinner>;
}
```

_Color:_

```tsx
import { Spinner } from "@easypost/easy-ui/Spinner";

function Component() {
  return <Spinner color="primary.500">Loading...</Spinner>;
}
```

### Anatomy

```tsx
export function Spinner(props: SpinnerProps) {
  const { size, color, children } = props;
  const id = useId();
  const style = {
    ...getComponentThemeToken("spinner", "background", "color", color),
    ...getResponsiveDesignToken("spinner", "size", "size.icon", size),
  } as React.CSSProperties;
  return (
    <div
      className={styles.spinner}
      style={style}
      role="alert"
      aria-label={children ? undefined : "loading"}
      aria-labelledby={children ? undefined : id}
    >
      <div className={styles.spinnerCircle} />
      {children && (
        <Text id={id} color={color}>
          {children}
        </Text>
      )}
    </div>
  );
}
```

---

## Behavior

### Accessibility

- Spinner always has the `role="alert"` attribute.

- Spinner must have `aria-label` or `aria-labelledby` depends on the visibility of the label.

### Dependencies

There are no major dependencies to highlight for this component
