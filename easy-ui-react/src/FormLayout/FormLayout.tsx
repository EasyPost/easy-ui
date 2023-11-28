import React, {
  ComponentProps,
  ElementType,
  ReactNode,
  createContext,
  useContext,
} from "react";
import { HorizontalGrid, HorizontalGridProps } from "../HorizontalGrid";
import { Text } from "../Text";
import { Heading } from "../types";
import { classNames } from "../utilities/css";

import styles from "./FormLayout.module.scss";

export type FormLayoutProps<T extends ElementType = "div"> =
  ComponentProps<T> & {
    as?: T;
    children: ReactNode;
  };

export type FormLayoutHeaderProps = {
  children: ReactNode;
};

export type FormLayoutTitleProps = {
  id?: string;
  as?: Heading;
  children: ReactNode;
};

export type FormLayoutHelperTextProps = {
  children: ReactNode;
};

export type FormLayoutSectionProps = {
  children: ReactNode;
};

export type FormLayoutGridProps = {
  children: ReactNode;
  columns: HorizontalGridProps["columns"];
};

const SectionContext = createContext(false);

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

function FormLayoutHeader(props: FormLayoutHeaderProps) {
  const { children } = props;
  return <div className={styles.header}>{children}</div>;
}

function FormLayoutTitle(props: FormLayoutTitleProps) {
  const sectionContext = useContext(SectionContext);
  const { as = "span", children, ...restProps } = props;
  if (sectionContext && props.as) {
    throw new Error("The as prop is not valid on a section title");
  }
  return (
    <Text
      {...restProps}
      as={sectionContext ? "legend" : as}
      variant={sectionContext ? "heading5" : "heading3"}
    >
      {children}
    </Text>
  );
}

function FormLayoutHelperText(props: FormLayoutTitleProps) {
  const { children } = props;
  return <Text variant="body1">{children}</Text>;
}

function FormLayoutSection(props: FormLayoutSectionProps) {
  const { children } = props;
  const className = classNames(styles.FormLayoutSection);
  return (
    <SectionContext.Provider value={true}>
      <fieldset className={className}>{children}</fieldset>
    </SectionContext.Provider>
  );
}

function FormLayoutGrid(props: FormLayoutGridProps) {
  const { children, columns } = props;
  return (
    <HorizontalGrid columns={columns} gap="2">
      {children}
    </HorizontalGrid>
  );
}

FormLayout.Header = FormLayoutHeader;
FormLayout.Title = FormLayoutTitle;
FormLayout.HelperText = FormLayoutHelperText;
FormLayout.Section = FormLayoutSection;
FormLayout.Grid = FormLayoutGrid;
