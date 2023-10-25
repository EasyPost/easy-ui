import React, { ReactNode } from "react";
import { Content } from "./Content";
import { Header } from "./Header";
import { SidePanel } from "./SidePanel";
import { WizardContent } from "./WizardContent";

import styles from "./FocusedProductLayout.module.scss";

export type FocusedProductLayoutProps = {
  children: ReactNode;
  renderSidePanel?: () => ReactNode;
};

export function FocusedProductLayout({
  children,
  renderSidePanel,
}: FocusedProductLayoutProps) {
  return (
    <div className={styles.FocusedProductLayout}>
      <div className={styles.container}>
        <div className={styles.content}>{children}</div>
        {renderSidePanel && (
          <div className={styles.sidePanel}>{renderSidePanel()}</div>
        )}
      </div>
    </div>
  );
}

FocusedProductLayout.Header = Header;
FocusedProductLayout.SidePanel = SidePanel;
FocusedProductLayout.Content = Content;
FocusedProductLayout.WizardContent = WizardContent;
