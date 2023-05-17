# `Badge` Component Specification

## Overview

A Badge is a visual text label for small bits of supporting information.

### Use Cases

- Categorizing information
- Getting a user's attention
- Describe metadata

### Features

- Color coordinated
- Exhaustive combination set of text and icons
- Single size

### Risks and Challenges

- Minimizing confusion around accessibility when considering Badge contents along with an optional accessibility label
- Keeping the API clear with all of the different possible states that the Badge can be in
- Extending our theme tokens with the variants

### Prior Art

- [Polaris `<Badge />`](https://polaris.shopify.com/components/feedback-indicators/badge)
- [Paste `<Badge />`](https://paste.twilio.design/components/badge)
- [Spectrum `<Badge />`](https://react-spectrum.adobe.com/react-spectrum/Badge.html)
- [Primer `<Label />`](https://primer.style/react/Label)

---

## Design

A `Badge` is a relatively straightforward component. No dependencies on external libraries as it requires only basic markup. Our primitives library, React Aria, in fact doesn't have any hooks to support such a component due to its simplicity.

### API

```ts
type BadgeVariant =
  | "primary"
  | "secondary"
  | "black"
  | "inverse"
  | "gray"
  | "success"
  | "warning"
  | "danger";

type Badge = {
  /**
   * Accessible label for badge if it differs from its content.
   * Required for icon-only badges.
   */
  accessibilityLabel?: string;

  /** Primary badge label */
  children?: ReactNode;

  /** Badge icon */
  icon?: IconSymbol;

  /**
   * Any additional text to support the primary label.
   * Only applicable on text-only badges.
   */
  secondaryLabel?: ReactNode;

  /**
   * Badge variant
   * @default primary
   */
  variant?: BadgeVariant;
};
```

### Example Usage

_Simple text:_

```tsx
import { Badge } from "@easypost/easy-ui/Badge";

function Component() {
  return <Badge>Badge text</Badge>;
}
```

_Simple icon:_

```tsx
import { Badge } from "@easypost/easy-ui/Badge";

function Component() {
  return <Badge accessibilityLabel="Intent of badge" icon={IconSymbol} />;
}
```

_Detailed icon:_

```tsx
import { Badge } from "@easypost/easy-ui/Badge";

function Component() {
  return <Badge icon={IconSymbol}>Badge text</Badge>;
}
```

_Detailed text:_

```tsx
import { Badge } from "@easypost/easy-ui/Badge";

function Component() {
  return (
    <Badge variant="negative" secondaryLabel="Last updated: Jan 3. 2023">
      Deprecated
    </Badge>
  );
}
```

### Anatomy

```ts
export function Badge(props: BadgeProps) {
  const {
    accessibilityLabel,
    children,
    secondaryLabel,
    icon,
    variant = "primary",
  } = props;

  const className = classNames(
    styles.root,
    styles[variationName("variant", variant)],
  );

  if (icon && secondaryLabel) {
    console.warn("icon and secondaryLabel is an invalid Badge state");
  }

  if (icon && !children && !accessibilityLabel) {
    console.warn("icon-only Badge must have an accessibilityLabel");
  }

  return (
    <span className={className}>
      <span
        className={styles.content}
        data-content-type={icon ? "icon" : "text"}
      >
        {icon ? <Icon symbol={icon} size="sm" /> : <>{children}</>}
      </span>
      {children && (icon || secondaryLabel) && (
        <span className={styles.support}>
          {secondaryLabel ? <>{secondaryLabel}</> : <>{children}</>}
        </span>
      )}
    </span>
  );
}
```

---

## Behavior

### Accessibility

A badge may have an `accessibilityLabel` if the contents of the badge is insufficient to describe its purpose.

A badge that is only an icon must have an `accessibilityLabel` to describe the intent of the badge.

### Dependencies

- Requires a new `border_radius` value in our tokens.
- Will need to extend our theme tokens with the variants.
