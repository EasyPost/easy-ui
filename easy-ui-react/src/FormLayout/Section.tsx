import React, { ReactNode } from "react";
import { classNames } from "../utilities/css";
import { WithinSectionContext } from "./context";

import styles from "./Section.module.scss";

export type SectionProps = {
  children: ReactNode;
};

export function Section(props: SectionProps) {
  const { children } = props;
  const className = classNames(styles.Section);
  return (
    <WithinSectionContext.Provider value={true}>
      <fieldset className={className}>{children}</fieldset>
    </WithinSectionContext.Provider>
  );
}
