# `Button` Component Specification

## Design

### API

```ts
export type ButtonColor =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "neutral"
  | "support"
  | "inverse";
export type ButtonVariant = "filled" | "outlined" | "link";
export type ButtonSize = "sm" | "md";
export type ButtonProps = {
  /**
   * Button color
   * @default "primary"
   */
  color?: ButtonColor;
  /**
   * Button variant
   * @default "filled"
   */
  variant?: ButtonVariant;
  /**
   * Button size
   * @default "md"
   */
  size?: ButtonSize;
  /**
   * Disables button
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Button will grow to width of container
   * @default false
   */
  isBlock?: boolean;
  /**
   * Positions icon before children
   * @default undefined
   */
  iconAtStart?: IconSymbol;
  /**
   * Positions icon after children
   * @default undefined
   */
  iconAtEnd?: IconSymbol;
  /**
   * Content inside button
   * @default "Button"
   */
  children?: ReactNode;
  /**
   * Link's destination
   * @default ""
   */
  href?: string;
};
```

### Example Usage

```tsx
import Button from "@easypost/easy-ui/Button";
import AddIcon from "@easypost/easy-ui-icons/Add";
// Filled
<Button color="primary" />
<Button color="secondary" />
<Button color="success" />
<Button color="warning" />
<Button color="neutral" />
// Outlined
<Button color="primary" variant="outlined" />
<Button color="secondary" variant="outlined" />
<Button color="success" variant="outlined" />
<Button color="support" variant="outlined" />
<Button color="inverse" variant="outlined" />
// Link
<Button color="primary" variant="link" />
// Href
<Button color="primary"  href="https://www.easypost.com/" />
// Size
<Button size="sm" />
// Custom text
<Button>Login</Button>
// Icon
<Button color="neutral" iconAtStart={AddIcon} />
// Click event
<Button onPress={myEventHandler} />
```
