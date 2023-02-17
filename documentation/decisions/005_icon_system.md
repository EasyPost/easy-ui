---
status: Accepted
date: 2023-02-16
deciders: stephenjwatkins, OskiTheCoder, kevinalexliu
---

# Use source-based icon system

## Context and Problem Statement

Easy UI needs a scalable way to manage its icons. Its icon system should be performant, easy to use, and easy to manage.

## Decision Drivers

- Implementation obfuscated (e.g. icon fonts, SVG, etc)
- Constraint based (uses design tokens)
- Performand and considers bundle size
- Able to support responsive sizing
- Able to support variants (e.g. weight, outlined, multi-colored)
- Allow for external stakeholders to manage
- Custom icons (-www or -applications needing something highly contextual)
- Accessibility
- Able to be versioned easily
- Decoupled in the project dependency chain
- Easy to consume and use

## Considered Options

1. Sprite approach

```jsx
import { Icon } from "@easypost/easy-ui";

<Icon source="chevron" size="24px" color="#0000ff" />;
```

2. Component approach

```jsx
import { ChevronIcon } from "@easypost/easy-ui-icons";

<ChevronIcon size="24px" color="#0000ff" />;
```

3. Source approach

```jsx
import { Icon } from "@easypost/easy-ui";
import { ChevronIcon } from "@easypost/easy-ui-icons";

<Icon source={ChevronIcon} size="24px" color="#0000ff" />;
```

## Decision Outcome

At first glance, the Component approach feels like the correct choice, given its friendliness to consume. However, after understanding the drawbacks that come with the Component approach, along with the benefits that come with the Source approach, we decided to use the Source approach.

The Source approach properly addresses all of the team's concerns while keeping the Easy UI infrastructure simple, not having to worry about versioning problems with circular dependency chains; and for many cases, it will end up being as easy as the Component approach to consume.

### Other Decisions

- Icon size should be responsive through its API
- Icon size should be constrained through our token system using t-shirt sizes
- Icon color should be constrained through our token system using the token color namespace. It should default to `current color` when not overridden
- Use SVGs instead of icon fonts
- Stick to one icon weight for now (former design team uses a couple)
- Output to SVG and SVGR

## More Information

We analyzed three approachers common to React coponent libraries:

1. Approach 1—Sprite Method

```jsx
import { Icon } from "@easypost/easy-ui";

<Icon source="chevron" size="24px" color="#0000ff" />;
```

- Where we are today.
- Only compatible with sprite sheets, either an icon font or SVG sprite file.
- Developer ergonomics can be nice. Only one import and working with strings is generally easier than components/classes.
- Implementation for more complex components in the future wouldn’t be seamless and would require a codemod or manual changes.
- Would require additional support for constraint system, TypeScript, and intellisense.
- Generally an approach of the past. Most component libraries use other approaches since this limits capabilities and is not as conducive to fine-grained code splitting.

2. Approach 2—Source Method

```jsx
import { Icon } from "@easypost/easy-ui";
import { ChevronIcon } from "@easypost/easy-ui-icons";

<Icon source={ChevronIcon} size="24px" color="#0000ff" />;
```

- Separates source from React component.
- Allows for the Icon component to be modified and versioned independently from their sources. This contributes to easier refactoring and maintenance.
- Source can be as simple or as complicated as needed. For icon fonts, the source would be a string representing the name of the icon; for SVGs, the source would be the actual SVG markup.
- Keeps the project for sources simpler. Allows for EZUI tooling to be more straightforward. Allows for easier collaboration across teams. Decouples symbols from React. Can output raw SVG and SVGR, for instance.
- Allows for passing in sources directly to components that render Icons, keeping the details of the rendering transparent to the consumer.
- Developer experience is less seamless when needing to render actual Icons. Two imports.
- Allows for custom symbols.
- Allows for using SVGR directly if needed.

3. Approach 3—Component Method

```jsx
import { ChevronIcon } from "@easypost/easy-ui-icons";

<ChevronIcon size="24px" color="#0000ff" />;
```

- Individual React component per icon.
- Easy to consume. No need to worry about separation of Icon from Glypth.
- Less separation of concerns. Would require an intermediate component to prevent circular dependencies.
- More complex infrastructure for converting backing symbols to React components.
- More difficulty and complexity in versioning symbols apart from the React-related code.
- Less obvious approach for supporting custom icons.
- Lack of separation between React and symbols makes it less intuitive for maintenance of symbols.
- Potentially less flexibility for the source implementation itself.

### Icon API

```jsx
import Icon from "@easypost/easy-ui/Icon"
import ChevronIcon from "@easypost/easy-ui-icons/ChevronIcon";

<Icon
  symbol={ChevronIcon}
  size="lg"  // t-shirt sizes. default to md
  size={{ sm: "xs", md: "sm", ["arbitrary"]: "xl" }} // responsive size prop
  color="status.info"  // default to currentColor, uses token color space
  accessibilityLabel="Add to cart"
/>

// in many situations, developers working with EZUI components wouldn't need to work with the <Icon /> component itself, and instead, pass in the symbol directly to another component:
<Button icon={ChevronIcon} />

// in components where the icon can be truly freeform (this will likely be rare), the component can clone an <Icon /> with supplied props
<Button
  icon={
    <Icon
      symbol={ChevronIcon}
      size="md"
      color="status.error"
    />
  }
/>

// variants:

// some icon sets (i.e. material symbols) use entirely different backing SVGs for their variants, in which case the variant would be reflected in the symbol itself:
<Icon symbol={ChevronIcon} // default (300 for EP)
<Icon symbol={Chevron400Icon} /> // 400 weight
<Icon symbol={ChevronFilledIcon} /> // filled
<Icon symbol={ChevronRoundedIcon} /> // rounded
<Icon symbol={ChevronRounded400Icon} /> // 400 rounded

// some icon sets use the same backing symbol for different variants, tweaking SVG properties for different variants, in which case it would be more appropriate for it to be a configuration of the Icon:
<WeightedIcon symbol={ChevronIcon} weight="400" />

// multi-colored SVG icons:
<MulticolorIcon
  symbol={MulticolorChevron}
  colorInner="blue-400"
  colorOuter="blue-800"
/>
```

### Tokens

Utilize token namespaces for icon sizing and color.

```
-ezui-size-icon- // new size token group. t-shirt sizes
  - md: 24px
-ezui-color- // use default color namespace for now
```

### Use SVG

#### Symbols are SVG

```typescript
export function Chevron() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="" />
    </svg>
  );
}
```

#### Utilize Material Symbols Package

Take advantage of [`@material-symbols/svg-300`](https://www.npmjs.com/package/@material-symbols/svg-300) package to use SVG instead of font icon:

```jsx
import Face from "@material-symbols/svg-300/outlined/face.svg";
```

### Outputs to SVG and SVGR

```jsx
// svg react components
import CheckmarkIcon from "@easypost/easy-ui-icons/Checkmark";

// svg
import checkmarkSvg from "@easypost/easy-ui-icons/svg/Checkmark";
```
