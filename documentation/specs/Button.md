# Button

```typescript
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
  /** Button color */
  // Defaults to primary
  color?: ButtonColor;
  /** Button variant */
  // Defaults to filled
  variant?: ButtonVariant;
  /** Button size */
  // Defaults to md
  size?: ButtonSize;
  /** Disables button */
  // Defaults to false
  isDisabled?: boolean;
  /** Button will grow to width of container */
  // Defaults to false
  isBlock?: boolean;
  /** Positions icon before children */
  // Defaults to null, only valid with md size
  iconAtStart?: ReactElement<IconProps>;
  /** Positions icon after children */
  // Defaults to null, only valid with md size
  iconAtEnd?: ReactElement<IconProps>;
  /** Content inside button  */
  // Defaults to "Button"
  children?: ReactNode;
  /** Link's destination */
  // Defaults to ""
  href?: string;
};
```

## Example

```jsx
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
<Button color="neutral" iconAtStart={<Icon symbol={AddIcon}/>} />
// Click event
<Button onPress={myEventHandler} />
```
