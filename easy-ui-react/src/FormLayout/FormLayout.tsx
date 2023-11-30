import React, { ComponentProps, ElementType, ReactNode } from "react";
import { classNames } from "../utilities/css";
import { Grid } from "./Grid";
import { Header } from "./Header";
import { HelperText } from "./HelperText";
import { Section } from "./Section";
import { Title } from "./Title";

import styles from "./FormLayout.module.scss";

export type FormLayoutProps<T extends ElementType> = ComponentProps<T> & {
  /**
   * Override the default element with a custom one.
   *
   * @default div
   */
  as?: T;

  /**
   * Content of the form layout.
   */
  children: ReactNode;
};

/**
 * Arranges a layout of form elements with preset spacing.
 *
 * @example
 * ```tsx
 * <FormLayout>
 *   <FormLayout.Header>
 *     <FormLayout.Title>Form Title</FormLayout.Title>
 *     <FormLayout.HelperText>Form info text</FormLayout.HelperText>
 *   </FormLayout.Header>
 *   <TextField
 *     label="Input 1"
 *     placeholder="Placeholder text"
 *     helperText="Helper text"
 *   />
 *   <TextField
 *     label="Input 2"
 *     placeholder="Placeholder text"
 *     helperText="Helper text"
 *   />
 *   <TextField
 *     label="Input 3"
 *     placeholder="Placeholder text"
 *     helperText="Helper text"
 *   />
 *   <TextField
 *     label="Input 4"
 *     placeholder="Placeholder text"
 *     helperText="Helper text"
 *   />
 * </FormLayout>
 * ```
 */
export function FormLayout<T extends ElementType = "div">(
  props: FormLayoutProps<T>,
) {
  const { as: As = "div", children, ...restProps } = props;
  const className = classNames(styles.FormLayout);
  return (
    <As className={className} {...restProps}>
      {children}
    </As>
  );
}

/**
 * Represents the header in a `<FormLayout />`.
 */
FormLayout.Header = Header;

/**
 * Represents a section in a `<FormLayout />`.
 */
FormLayout.Section = Section;

/**
 * Represents a grid in a `<FormLayout />`. Wrapper around `<HorizontalGrid />`.
 */
FormLayout.Grid = Grid;

/**
 * Represents a title in a `<FormLayout.Header />`.
 */
FormLayout.Title = Title;

/**
 * Represents helper text in a `<FormLayout.Header />`.
 */
FormLayout.HelperText = HelperText;
