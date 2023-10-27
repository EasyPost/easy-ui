import React, { ReactNode } from "react";
import { MenuOverlayProps } from "../Menu/MenuOverlay";
import { classNames, variationName } from "../utilities/css";
import { Content } from "./Content";
import { HeaderAtTopOfPage } from "./HeaderAtTopOfPage";
import { HeaderInContentArea } from "./HeaderInContentArea";
import { SidePanel } from "./SidePanel";
import { WizardContent } from "./WizardContent";

import styles from "./FocusedProductLayout.module.scss";

export type HeaderProps = {
  helpMenuItems: MenuOverlayProps<object>["children"];
  onHelpMenuAction?: MenuOverlayProps<object>["onAction"];
  renderBackArrow: (props: { children: ReactNode }) => ReactNode;
  renderLogo: () => ReactNode;
  title: ReactNode;
};

export type FocusedProductLayoutProps = HeaderProps & {
  content: ReactNode;
  sidePanel?: ReactNode;
  sidePanelPosition?: "start" | "end";
};

export function FocusedProductLayout(props: FocusedProductLayoutProps) {
  const { content, sidePanel, sidePanelPosition, title, ...headerProps } =
    props;
  const className = classNames(
    styles.FocusedProductLayout,
    sidePanelPosition &&
      styles[variationName("sidePanelPosition", sidePanelPosition)],
  );
  return (
    <div className={className}>
      <div className={styles.topBar}>
        <HeaderAtTopOfPage {...headerProps} />
      </div>
      <div className={styles.contentContainer}>
        <HeaderInContentArea {...headerProps} title={title} />
        {content}
      </div>
      {sidePanel}
    </div>
  );
}

FocusedProductLayout.SidePanel = SidePanel;
FocusedProductLayout.Content = Content;
FocusedProductLayout.WizardContent = WizardContent;
