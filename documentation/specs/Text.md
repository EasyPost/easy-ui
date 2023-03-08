# Text

```typescript
type TextVariant = TokenNamespace<"font-style">;
type TextAs = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
type TextColor = TokenNamespace<"color">;
type TextWeight = "normal" | "medium" | "semibold" | "bold";

type Text = {
  // Adjusts horizontal alignment of text
  //   defaults to start
  alignment?: "start" | "center" | "end" | "justify";
  // Adjusts the underlying element of the text
  //   defaults to span
  as?: TextAs;
  // Prevent text from overflowing inline container
  //   defaults to false
  breakWord?: boolean;
  // Text content
  children: ReactNode;
  // Adjust color of text
  //   defaults to inherited color
  color?: TextColor;
  // HTML id attribute
  //   defaults to none
  id?: string;
  // Truncate text overflow with ellipsis
  //   defaults to false
  truncate?: boolean;
  // Adjusts the style of text that's rendered
  //   optional to allow for nesting/inheritance
  variant?: TextVariant;
  // Visually hide the text but keep it accessible
  //   defaults to false
  visuallyHidden?: boolean;
  // Adjust weight of text
  //   defaults to the supplied variant weight
  weight?: TextWeight;
};
```

## Example

```jsx
import Text from "@easypost/easy-ui/Text";

<Text variant="body1">Standard body text rendered as a span</Text>;

<Text variant="body1" alignment="center" color="blue-500">
  Standard body text rendered as a span, centered, and colored blue 500
</Text>;

<Text variant="heading2" as="h2" id="unique-heading-id">
  Heading level 2 text
</Text>;

<Text variant="body2" as="p">
  Small paragraph text with <Text weight="bold">bold text inside</Text>
</Text>;

<Text visuallyHidden>
  Description of icon or image visually hidden but still in tree
</Text>;
```
