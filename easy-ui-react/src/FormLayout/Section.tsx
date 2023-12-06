import React, {
  NamedExoticComponent,
  ReactNode,
  isValidElement,
  useMemo,
} from "react";
import { Text } from "../Text";
import { classNames } from "../utilities/css";
import { deepFind } from "../utilities/react";
import { WithinSectionContext } from "./context";

import styles from "./Section.module.scss";

export type SectionProps = {
  /**
   * Content of the form section.
   */
  children: ReactNode;
};

export function Section(props: SectionProps) {
  const { children } = props;
  const className = classNames(styles.Section);

  // A `fieldset`'s `legend` has to be the first child of a fieldset, so we
  // search recursively through the Section's children to find the first Title
  // component and extract the text from it to use in this component
  const sectionTitle = useMemo(() => {
    return findSectionTitleInChildren(children);
  }, [children]);

  return (
    <WithinSectionContext.Provider value={true}>
      <fieldset className={className}>
        {sectionTitle && (
          <Text as="legend" visuallyHidden>
            {sectionTitle}
          </Text>
        )}
        {children}
      </fieldset>
    </WithinSectionContext.Provider>
  );
}

Section.displayName = "FormLayout.Section";

function findSectionTitleInChildren(children: ReactNode) {
  // look for the first `FormLayout.Title` or `FormLayout.Section` element.
  // if we encounter a Section before a Title we know the outer Section
  // doesn't have a title (or it's wildly [and incorrectly] out of order)
  const firstTitleOrSection = deepFind(children, (child) => {
    if (!isValidElement(child)) {
      return false;
    }
    const childType = child.type as NamedExoticComponent;
    return (
      childType.displayName === "FormLayout.Section" ||
      childType.displayName === "FormLayout.Title"
    );
  });

  if (!isValidElement(firstTitleOrSection)) {
    return null;
  }

  const firstTitleOrSectionType =
    firstTitleOrSection.type as NamedExoticComponent;
  return firstTitleOrSectionType.displayName === "FormLayout.Title"
    ? firstTitleOrSection.props.children
    : null;
}
