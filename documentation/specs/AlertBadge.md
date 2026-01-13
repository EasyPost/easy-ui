# `AlertBadge` Component Specification

## Overview

An AlertBadge is a visual notification "badge"/"bubble" to indicate supporting information or actions required.

### Use Cases
- Indicating user action is required
- Categorizing information
- Getting a user's attention

### Features

- Color variants
- Position placement
- Include an icon
- Single size

### Risks and Challenges

- Minimizing confusion around accessibility when considering Badge contents along with an optional accessibility label
- Keeping the API clear with all of the different possible states that the Badge can be in
- Extending our theme tokens with the variants

### Prior Art

---

## Design

An `AlertBadge` is a relatively straightforward component. No dependencies on external libraries as it requires only basic markup. Our primitives library, React Aria, in fact doesn't have any hooks to support such a component due to its simplicity.

### API

```ts
type AlertBadgeVariant = "primary" | "secondary" | "success" | "danger";

type AlertBadgePlacement = "top right" | "bottom right";

type AlertBadgeProps = {
  /** AlertBadge placement
   * @default top right
   */
  placement?: AlertBadgePlacement;

  /** AlertBadge icon (IconSymbol)
   * @default undefined
   */
  icon?: IconSymbol;

  /**
   * Accessible label for the AlertBadge.
   * @default Alert Badge
   */
  accessibilityLabel?: string;

  /**
   * AlertBadge variant.
   * @default danger
   */
  variant?: AlertBadgeVariant;

  /** AlertBadge attachment target. */
  children: ReactNode;

  /**  Show/hide AlertBadge. */
  show: boolean;
};
```

### Example Usage

_Variants:_

```tsx
import { AlertBadge } from "@easypost/easy-ui/AlertBadge";
import { Button } from "@easypost/easy-ui/Button";

function Component() {
  return (
    <AlertBadge show variants="success">
      <Button>Button</Button>
    </AlertBadge>
  );
}
```

_Placement:_

```tsx
import { AlertBadge } from "@easypost/easy-ui/AlertBadge";
import { Button } from "@easypost/easy-ui/Button";

function Component() {
  return (
    <AlertBadge show placement="bottom right">
      <Button>Button</Button>
    </AlertBadge>
  );
}
```

_Icon:_

```tsx
import { AlertBadge } from "@easypost/easy-ui/AlertBadge";
import { Button } from "@easypost/easy-ui/Button";

function Component() {
  return (
    <AlertBadge show icon={IconSymbol}>
      <Button>Button</Button>
    </AlertBadge>
  );
}
```

### Anatomy

```ts
export function AlertBadge(props: AlertBadgeProps) {
  const {
    accessibilityLabel = "Alert Badge",
    placement = DEFAULT_PLACEMENT,
    variant = DEFAULT_VARIANT,
    icon,
    show,
    children,
  } = props;

  const className = classNames(
    styles.root,
    styles[variationName("variant", variant)],
    ...placement.split(" ").map((position) => styles[position]),
  );

  if (!show) {
    return children;
  }

  return (
    <span className={styles.container}>
      <Text visuallyHidden>{accessibilityLabel}</Text>
      {children}
      <span className={className} data-testid="root">
        <span className={styles.badge} role="status">
          {icon && <Icon symbol={icon} size="2xs" />}
        </span>
      </span>
    </span>
  );
}
```

---

## Behavior

### Accessibility

An alert badge may have an `accessibilityLabel` to describe its purpose. A generic label is added by default.

### Dependencies

- Will need to extend our theme tokens with the variants.
