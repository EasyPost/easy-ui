import React, { ComponentProps, ElementType, ReactNode } from "react";
import { classNames } from "../utilities/css";
import { Grid } from "./Grid";
import { Header } from "./Header";
import { HelperText } from "./HelperText";
import { Section } from "./Section";
import { Title } from "./Title";

import styles from "./FormLayout.module.scss";

export type FormLayoutProps<T extends ElementType = "div"> =
  ComponentProps<T> & {
    as?: T;
    children: ReactNode;
  };

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

FormLayout.Header = Header;
FormLayout.Title = Title;
FormLayout.HelperText = HelperText;
FormLayout.Section = Section;
FormLayout.Grid = Grid;
