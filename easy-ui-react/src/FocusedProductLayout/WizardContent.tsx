import React, { ReactNode } from "react";
import { Button } from "../Button";
import { Stepper, StepperProps } from "../Stepper";

import styles from "./WizardContent.module.scss";

export type WizardContentProps = {
  /**
   * The active step, represented as an index of the sequence.
   */
  activeStepIndex: StepperProps["activeStepIndex"];

  /**
   * Content to render for the active wizard step.
   */
  children: ReactNode;

  /**
   * Configuration for the wizard's next action button.
   */
  nextAction: WizardContentActionProps;

  /**
   * Configuration for the wizard's previous action button.
   */
  previousAction: WizardContentActionProps;

  /**
   * The steps to render, represented as `<Stepper.Step/ >`.
   */
  steps: StepperProps["children"];
};

type WizardContentActionProps = {
  /**
   * The action's text.
   */
  content: string;

  /**
   * Handler to run for the action. Should generally progress or regress
   * the stepper.
   */
  onAction: () => void;

  /**
   * Whether or not the action is disabled.
   */
  isDisabled?: boolean;
};

/**
 * @privateRemarks
 * Represents a wizard type of content to be used within a FocusedProductLayout.
 *
 * @private
 * @ignore
 */
export function WizardContent(props: WizardContentProps) {
  const { activeStepIndex, steps, previousAction, nextAction, children } =
    props;
  return (
    <div className={styles.WizardContent}>
      <div className={styles.stepperContainer}>
        <div
          className={styles.stepper}
          data-testid="focused-product-layout-wizard-content-stepper"
        >
          <Stepper activeStepIndex={activeStepIndex}>{steps}</Stepper>
        </div>
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
