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
export type ButtonAppearance = "filled" | "outlined" | "link";
export type ButtonSize = "sm" | "md";

export type ButtonProps = {
  /** Button color */
  // Defaults to primary
  color?: ButtonColor;
  /** Button appearance */
  // Defaults to filled
  appearance?: ButtonAppearance;
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
  startIcon?: ReactElement<IconProps>;
  /** Positions icon after children */
  // Defaults to null, only valid with md size
  endIcon?: ReactElement<IconProps>;
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
<Button color="primary" appearance="outlined" />
<Button color="secondary" appearance="outlined" />
<Button color="success" appearance="outlined" />
<Button color="support" appearance="outlined" />
<Button color="inverse" appearance="outlined" />

// Link
<Button color="primary" appearance="link" />

// Href
<Button color="primary"  href="https://www.easypost.com/" />

// Size
<Button size="sm" />

// Custom text
<Button>Login</Button>

// Icon
<Button color="neutral" startIcon={<Icon symbol={AddIcon}/>} />

// Click event
<Button onPress={myEventHandler} />
```
