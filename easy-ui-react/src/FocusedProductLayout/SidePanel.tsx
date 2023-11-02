import React, { ReactNode } from "react";
import { getComponentToken } from "../utilities/css";

import styles from "./SidePanel.module.scss";

export type SidePanelProps = {
  /**
   * Content for the side panel.
   */
  children: ReactNode;

  /**
   * A valid `flex-basis` value for the side panel.
   */
  width?: string;
};

export function SidePanel(props: SidePanelProps) {
  const { children, width = "auto" } = props;
  const style = {
    ...getComponentToken(
      "focused-product-layout-side-panel",
      "flex-basis",
      width,
    ),
  };
  return (
    <aside className={styles.SidePanel} style={style}>
      {children}
    </aside>
  );
}
