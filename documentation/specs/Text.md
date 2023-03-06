# Icon

```typescript
type TextVariant = TokenNamespace<"font-style">;
type TextAs = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
type TextColor = TokenNamespace<"color">;

type Text = {
  // Adjusts the style of text that's rendered
  //   defaults to body1
  variant?: TextVariant;
  // Adjusts horizontal alignment of text
  //   defaults to start
  alignment?: "start" | "center" | "end" | "justify";
  // Adjusts the underlying element of the text
  //   defaults to span
  as?: TextAs;
  // Adjust color of text
  //   defaults to inherited color
  color?: TextColor;
  // HTML id attribute
  //   defaults to none
  id?: string;
  // Visually hide the text but keep it accessible
  //   defaults to false
  visuallyHidden?: boolean;
};
```

## Example

```jsx
import Text from "@easypost/easy-ui/Text";

<Text>Standard body text rendered as a span</Text>;

<Text alignment="center" color="blue-500">
  Standard body text rendered as a span, centered, and colored blue 500
</Text>;

<Text variant="heading2" as="h2" id="unique-heading-id">
  Heading level 2 text
</Text>;

<Text variant="body2" as="p">
  Small paragraph text
</Text>;

<Text visuallyHidden>
  Description of icon or image visually hidden but still in tree
</Text>;
```
