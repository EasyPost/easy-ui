import React, { ReactNode } from "react";
import { Text } from "../Text";
import { InputSize } from "./InputField";
import styles from "./InputField.module.scss";
import { classNames } from "../utilities/css";
import { VisuallyHidden } from "react-aria";
import { Label as AriaLabel } from "react-aria-components";

/**
 * How a field's label marks whether the field is required.
 *
 * - `"icon"`: a trailing `*` when the field is required, nothing otherwise.
 * - `"label"`: a trailing "(required)" or "(optional)".
 */
export type NecessityIndicator = "icon" | "label";

export type LabelProps = {
  /**
   * Label text displays with emphasis.
   * @default false
   */
  isLabelEmphasized?: boolean;
  /**
   * Size of associated field.
   * @default 'md'
   */
  fieldSize?: InputSize;
  /**
   * Label text displays with error styles.
   * @default false
   */
  hasError?: boolean;
  /**
   * Whether the associated field is required.
   * @default false
   */
  isRequired?: boolean;
  /**
   * How the label marks whether the associated field is required.
   * @default 'icon'
   */
  necessityIndicator?: NecessityIndicator;
  /**
   * Whether the necessity indicator is read as part of the field's accessible
   * name. Set it for fields whose element can't carry a required state, such
   * as `Select`'s `button` trigger, so assistive tech still hears "required".
   * @default false
   */
  includeNecessityIndicatorInAccessibilityName?: boolean;
  /** Label content. */
  children: ReactNode;
};

/**
 * @privateRemarks
 * The Label component has been designed for use on the InputField component.
 * Appears above inputs and handles sizing, visual styles for emphasis and
 * error states, and can be visually hidden.
 *
 * The necessity indicator follows React Spectrum's `Label`. The `*` and
 * "(required)" are hidden from assistive tech so they stay out of the field's
 * accessible name; the input's `required` attribute conveys that state.
 * "(optional)" is left in the accessible name since nothing else conveys it.
 * Fields whose element has no required state (`Select`'s `button` trigger)
 * set `includeNecessityIndicatorInAccessibilityName`, which, as in Spectrum,
 * reads the indicator as "(required)".
 */
export function Label(props: LabelProps) {
  const {
    isLabelEmphasized = false,
    fieldSize = "md",
    hasError = false,
    isRequired = false,
    necessityIndicator = "icon",
    includeNecessityIndicatorInAccessibilityName = false,
    children,
    ...labelProps
  } = props;

  const textVariant = isLabelEmphasized
    ? "subtitle1"
    : fieldSize === "sm"
      ? "body2"
      : "body1";
  const as = isLabelEmphasized ? "strong" : "span";
  const color = hasError ? "danger" : undefined;
  return (
    <AriaLabel {...labelProps} className={classNames(styles.label)}>
      <Text variant={textVariant} as={as} color={color}>
        {children}
        {necessityIndicator === "icon" && isRequired && (
          <>
            <span aria-hidden="true" className={styles.necessityIndicator}>
              *
            </span>
            {includeNecessityIndicatorInAccessibilityName && (
              <VisuallyHidden>{" (required)"}</VisuallyHidden>
            )}
          </>
        )}
        {necessityIndicator === "label" && (
          // A text-node space (not a margin) so the accessible name reads
          // "Name (optional)" rather than "Name(optional)".
          <>
            {" "}
            <span
              aria-hidden={
                isRequired && !includeNecessityIndicatorInAccessibilityName
                  ? "true"
                  : undefined
              }
            >
              {isRequired ? "(required)" : "(optional)"}
            </span>
          </>
        )}
      </Text>
    </AriaLabel>
  );
}
