---
status: Accepted
date: 2023-02-28
deciders: stephenjwatkins, OskiTheCoder, kevinalexliu
---

# Support responsive props

## Context and Problem Statement

Easy UI needs to faciliate changing component properties based on screen width.

## Decision Drivers

- Friendly to adopt by consumers of Easy UI
- Simple to implement in Easy UI
- Independent of consumer's build system

## Decision Outcome

We will use a breakpoint object schema for updating property values at different breakpoints. This schema will be exposed on specific component properties that need responsive support.

## More Information

When developing with traditional CSS, because React doesn't support setting `style` values for media queries, developers will often reach into the CSS of components to update styles for different screen sizes. This type of mechanism breaks component encapsulation, causing inconsistency and brittle code.

Easy UI will offer a mechanism on the component API to change styles based on defined breakpoints. This will keep layout and paint changes confined to our screen constraints and keep style changes narrowed to what the component API offers.

Easy UI will use a breakpoint-based property schema to support this.

### Spec

```typescript
type BreakpointAlias = "xs" | "sm" | "md" | "lg" | "xl" | "xxl";

type ResponsiveProperty<T> =
  | T
  | {
      [key in BreakpointAlias]?: T;
    };

type Icon = {
  size: ResponsiveProperty<string>;
};
```

```jsx
<Icon
  size={{
    xs: "16px",
    md: "24px",
    xl: "32px",
  }}
/>
```

Implementing responsive properties requires two parts—defining in the component and using the SCSS.

### Defining in the component

#### Simple value

```jsx
import { getResponsiveValue } from "../utilities/css";

export function Icon({ size = "24px" }) {
  const style = getResponsiveValue("icon", "size", size);
  return (
    <span style={style}>
      <!-- Icon -->
    </span>
  );
}

// Results:
//
// <span style={{ "--ezui-c-icon-size-xs": "24px" }}>
```

#### Responsive value

```jsx
import { getResponsiveValue } from "../utilities/css";

export function Icon({ size = { xs: "16px", md: "24px", xl: "32px" } }) {
  const style = getResponsiveValue("icon", "size", "size-icon", size);
  return (
    <span style={style}>
      <!-- Icon -->
    </span>
  );
}

// Results:
//
// <span style={{
//   "--ezui-c-icon-size-xs": var(--ezui-size-icon-sm),
//   "--ezui-c-icon-size-md": var(--ezui-size-icon-md),
//   "--ezui-c-icon-size-xl": var(--ezui-size-icon-lg)
// }}>
```

#### Design tokens

```jsx
import { getResponsiveToken } from "../utilities/css";

export function Icon({ size = "md" }) {
  const style = getResponsiveToken("icon", "size", "size-icon", size);
  return (
    <span style={style}>
      <!-- Icon -->
    </span>
  );
}

// Results:
//
// <span style={{ "--ezui-c-icon-size-xs": var(--ezui-size-icon-md) }}>
```

#### Responsive design tokens

```jsx
import { getResponsiveToken } from "../utilities/css";

export function Icon({ size = { xs: "sm", md: "md", xl: "lg" } }) {
  const style = getResponsiveToken("icon", "size", "size-icon", size);
  return (
    <span style={style}>
      <!-- Icon -->
    </span>
  );
}

// Results:
//
// <span style={{ "--ezui-c-icon-size-xs": var(--ezui-size-icon-md) }}>
```

### Using in SCSS

```scss
// Results:
//
// .Icon {
//   width: var(--ezui-c-icon-size);
//   height: var(--ezui-c-icon-size);
// }
.Icon {
  @include responsive-props("icon", "size") using ($var) {
    width: $var;
    height: $var;
  }
}

// For assigning to a single prop, you can use the shorthand. Results:
//
// .Icon {
//   gap: var(--ezui-c-icon-size);
// }
.Icon {
  @include responsive-prop("icon", "size", "gap");
}
```

### Example

With the above implementation, the `Icon` component can be used like so:

```jsx
// Simple values
<Icon size="24px">
<Icon size={{ xs: '16px', md: '24px' }}>

// Design tokens
<Icon size="md">
<Icon size={{ xs: 'sm', md: 'md', xl: 'lg' }}>
```
