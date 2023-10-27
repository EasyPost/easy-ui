import React, { ReactNode } from "react";
import { MenuOverlayProps } from "../Menu/MenuOverlay";
import { classNames, variationName } from "../utilities/css";
import { Content } from "./Content";
import { HeaderAtTopOfPage, HeaderInContentArea } from "./Header";
import { SidePanel } from "./SidePanel";
import { WizardContent } from "./WizardContent";

import styles from "./FocusedProductLayout.module.scss";

export type FocusedProductLayoutProps = {
  content: ReactNode;
  helpMenuItems: MenuOverlayProps<object>["children"];
  onHelpMenuAction?: MenuOverlayProps<object>["onAction"];
  renderBackArrow: (props: { children: ReactNode }) => ReactNode;
  renderLogo: () => ReactNode;
  sidePanel?: ReactNode;
  sidePanelPosition?: "start" | "end";
  title: ReactNode;
};

export function FocusedProductLayout(props: FocusedProductLayoutProps) {
  const {
    content,
    helpMenuItems,
    onHelpMenuAction,
    renderBackArrow,
    renderLogo,
    sidePanel,
    sidePanelPosition,
    title,
  } = props;
  const className = classNames(
    styles.FocusedProductLayout,
    sidePanelPosition &&
      styles[variationName("sidePanelPosition", sidePanelPosition)],
  );
  return (
    <div className={className}>
      <div className={styles.topBar}>
        <HeaderAtTopOfPage
          helpMenuItems={helpMenuItems}
          onHelpMenuAction={onHelpMenuAction}
          renderBackArrow={renderBackArrow}
          renderLogo={renderLogo}
        />
      </div>
      <div className={styles.contentContainer}>
        <HeaderInContentArea
          helpMenuItems={helpMenuItems}
          onHelpMenuAction={onHelpMenuAction}
          renderBackArrow={renderBackArrow}
          renderLogo={renderLogo}
          title={title}
        />
        {content}
      </div>
      {sidePanel}
    </div>
  );
}

FocusedProductLayout.SidePanel = SidePanel;
FocusedProductLayout.Content = Content;
FocusedProductLayout.WizardContent = WizardContent;
