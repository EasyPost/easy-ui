import React from "react";
import CloseIcon from "@easypost/easy-ui-icons/Close";
import { Icon } from "../Icon";
import { Text } from "../Text";
import { IconSymbol } from "../types";
import { UnstyledButton } from "../UnstyledButton";
import styles from "./Pill.module.scss";

export type PillProps = {
  /** Text label */
  label: string;
  /** Left aligned icon */
  icon?: IconSymbol;
  /** Callback function when dismissing Pill */
  onDismiss?: () => void;
};

/**
 * A `Pill` is a compact element that displays contextual text
 * typically representing selections or options.
 *
 * @remarks
 * Supports dismissal via `onDismiss` prop and icons via the `icon`
 * prop.
 *
 * @example
```tsx
* import { Pill } from "@easypost/easy-ui/Pill";
*
* function Component({ carrier }) {
*   const CarrierImage = () => <Image src={`/${carrier}.png`} />;
*   return <Pill label="First Last #12345" icon={CarrierImage} />;
* }
*/
export function Pill(props: PillProps) {
  const { label, icon, onDismiss } = props;

  return (
    <span className={styles.Pill}>
      {icon && <Icon size="xs" symbol={icon} color="primary.700" />}
      <Text color="primary.800" variant="subtitle2">
        {label}
      </Text>
      {onDismiss && (
        <UnstyledButton
          className={styles.dismiss}
          onPress={onDismiss}
          aria-label={`Dismiss ${label}`}
        >
          <Icon size="xs" symbol={CloseIcon} color="primary.600" />
        </UnstyledButton>
      )}
    </span>
  );
}
