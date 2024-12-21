import React, { createContext, useContext, ReactNode } from "react";

import styles from "./ForgeLayoutHeader.module.scss";

export type ForgeLayoutHeaderProps = {
  /**
   * Whether ForgeLayout.Controls are grouped together or
   * spaced evenly with ForgeLayout.Actions
   *
   * @default true
   */
  areControlsGrouped?: boolean;

  /** Header children. */
  children: ReactNode;
};

export type ForgeLayoutHeaderContextType = {
  areControlsGrouped?: boolean;
};

const ForgeLayoutHeaderContext =
  createContext<ForgeLayoutHeaderContextType | null>(null);

export const useForgeLayoutHeader = () => {
  const context = useContext(ForgeLayoutHeaderContext);
  if (!context) {
    throw new Error(
      "useForgeLayoutHeader must be used within a ForgeLayoutHeader",
    );
  }
  return context;
};

export function ForgeLayoutHeader(props: ForgeLayoutHeaderProps) {
  const { areControlsGrouped = true, children } = props;

  return (
    <ForgeLayoutHeaderContext.Provider value={{ areControlsGrouped }}>
      <header className={styles.header}>
        <div className={styles.headerBg}></div>
        {children}
      </header>
    </ForgeLayoutHeaderContext.Provider>
  );
}
