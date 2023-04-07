# `Text` Component Specification

## Overview

A typography helper that will apply text styles to the text inside.

### Use Cases

This component is helpful in product-facing scenarios where components tend to be used all the way down the stack, it may be less helpful in marketing-facing situations where long-form prose is required.

### Features

Accepts an Easy UI text variant along with other font-related props to adjust the rendered text within Easy UI's constraint system.

### Prior Art

- [Polaris <Text />](https://polaris.shopify.com/components/typography/text)
- [Primer <Text />](https://primer.style/react/Text)

---

## Design

### API

```tsx
type TextAs = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
type TextWeight = "normal" | "medium" | "semibold" | "bold";
type TextVariant = DesignTokenNamespace<"font.style", "family">;
type TextColor = ThemeTokenNamespace<"color.text">;

type Text = {
  /** Adjusts horizontal alignment of text */
  alignment?: "start" | "center" | "end" | "justify";
  /* Adjusts the underlying element of the text */
  as?: TextAs;
  /** Prevent text from overflowing inline container */
  breakWord?: boolean;
  /** Text to display */
  children: ReactNode;
  /** Adjust color of text */
  color?: TextColor;
  /** HTML id attribute */
  id?: string;
  /** Truncate text overflow with ellipsis */
  truncate?: boolean;
  /** Adjusts the style of text that's rendered */
  variant?: TextVariant;
  /** Visually hide the text but keep it accessible */
  visuallyHidden?: boolean;
  /** Adjust weight of text */
  weight?: TextWeight;
};
```

### Example Usage

```tsx
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

---

## Behavior

### Accessibility

Given the simplicity of the component, there aren't many accessibility concerns for `<Text />`.

`<Text />` will accept a `visuallyHidden` attribute that allows it to be used for embedding visually hidden text in other components that need accessibility labels.

`<Text />` will accept an `id` attribute for being globally identified in the document, such as serving headings as anchor links.
