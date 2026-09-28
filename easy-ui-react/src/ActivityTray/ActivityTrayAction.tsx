import React, { ReactNode } from "react";
import { UnstyledButton } from "../UnstyledButton";
import styles from "./ActivityTray.module.scss";

export type ActivityTrayActionProps = {
  /** Action label. Keep it to one or two words—the row is narrow. */
  children: ReactNode;
  /** Called when the action is pressed. */
  onPress?: () => void;
  /**
   * Destination, for an action that navigates. Routes through the `navigate`
   * function given to `<Provider />` when there is one.
   */
  href?: string;
};

/**
 * An action on a task row—Cancel while it runs, Retry or View once it's done.
 *
 * @remarks
 * Keep it to two per row. Rows are not clickable as a whole, so these are the
 * only affordances a task has; a whole-row click target wrapping nested buttons
 * is ambiguous for pointer users and broken for keyboard users.
 *
 * @example
 * ```tsx
 * <ActivityTray.Task title="Buying labels" status="running">
 *   <ActivityTray.Action onPress={cancel}>Cancel</ActivityTray.Action>
 * </ActivityTray.Task>
 * ```
 */
export function ActivityTrayAction(props: ActivityTrayActionProps) {
  const { children, onPress, href } = props;
  return (
    <UnstyledButton className={styles.action} onPress={onPress} href={href}>
      {children}
    </UnstyledButton>
  );
}

ActivityTrayAction.displayName = "ActivityTray.Action";
