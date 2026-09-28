import React, { ReactNode } from "react";
import { UnstyledButton } from "../UnstyledButton";
import styles from "./TaskTray.module.scss";

export type TaskTrayActionProps = {
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
 * <TaskTray.Task title="Buying labels" status="running">
 *   <TaskTray.Action onPress={cancel}>Cancel</TaskTray.Action>
 * </TaskTray.Task>
 * ```
 */
export function TaskTrayAction(props: TaskTrayActionProps) {
  const { children, onPress, href } = props;
  return (
    <UnstyledButton className={styles.action} onPress={onPress} href={href}>
      {children}
    </UnstyledButton>
  );
}

TaskTrayAction.displayName = "TaskTray.Action";
