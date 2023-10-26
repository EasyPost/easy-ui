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

export function WizardContent(props: WizardContentProps) {
  const { stepper, previousAction, nextAction, children } = props;
  return (
    <div className={styles.WizardContent}>
      <div className={styles.stepperContainer}>
        <div className={styles.stepper}>{stepper}</div>
      </div>
      <main className={styles.main}>{children}</main>
      <div className={styles.footer}>
        <Button
          variant="outlined"
          color="support"
          onPress={previousAction.onAction}
        >
          {previousAction.content}
        </Button>
        <Button onPress={nextAction.onAction}>{nextAction.content}</Button>
      </div>
    </div>
  );
}
