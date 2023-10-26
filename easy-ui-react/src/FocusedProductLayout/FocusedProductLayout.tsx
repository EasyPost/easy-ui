import React, { ReactNode } from "react";
import { classNames, variationName } from "../utilities/css";
import { Content } from "./Content";
import { Header } from "./Header";
import { SidePanel } from "./SidePanel";
import { WizardContent } from "./WizardContent";

import styles from "./FocusedProductLayout.module.scss";

export type FocusedProductLayoutProps = {
  content: ReactNode;
  header: ReactNode;
  sidePanel?: ReactNode;
  sidePanelPosition?: "start" | "end";
};

export function FocusedProductLayout(props: FocusedProductLayoutProps) {
  const { content, header, sidePanel, sidePanelPosition } = props;
  const className = classNames(
    styles.FocusedProductLayout,
    sidePanelPosition &&
      styles[variationName("sidePanelPosition", sidePanelPosition)],
  );
  return (
    <div className={className}>
      <div className={styles.contentContainer}>
        {header}
        {content}
      </div>
      {sidePanel}
    </div>
  );
}

FocusedProductLayout.Header = Header;
FocusedProductLayout.SidePanel = SidePanel;
FocusedProductLayout.Content = Content;
FocusedProductLayout.WizardContent = WizardContent;
