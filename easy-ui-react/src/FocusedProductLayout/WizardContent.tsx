import React, { ReactNode } from "react";
import { Button } from "../Button";

import styles from "./WizardContent.module.scss";

export type WizardContentProps = {
  children: ReactNode;
  stepper: ReactNode;
  previousAction: WizardContentActionProps;
  nextAction: WizardContentActionProps;
};

type WizardContentActionProps = {
  content: string;
  onAction: () => void;
  isDisabled?: boolean;
};

export function WizardContent({
  stepper,
  previousAction,
  nextAction,
  children,
}: WizardContentProps) {
  return (
    <div className={styles.WizardContent}>
      <div className={styles.stepperContainer}>
        <div className={styles.stepper}>{stepper}</div>
      </div>
      <div className={styles.main}>{children}</div>
      <div className={styles.footer}>
        <Button variant="outlined" onPress={previousAction.onAction}>
          {previousAction.content}
        </Button>
        <Button onPress={nextAction.onAction}>{nextAction.content}</Button>
      </div>
    </div>
  );
}
