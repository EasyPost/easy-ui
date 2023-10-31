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
  /**
   * List of help menu items to render. Should be an array of `<Menu.Item />`s.
   */
  helpMenuItems: MenuOverlayProps<object>["children"];

  /**
   * Handler that is called when a help menu item is selected.
   */
  onHelpMenuAction?: MenuOverlayProps<object>["onAction"];

  /**
   * Back arrow to render in the header. The back functionality is completely
   * up to the consumer.
   *
   * @example
   * ```tsx
   * <FocusedProductLayout
   *   renderBackArrow={(props) => <a href="/account/settings" {...props} />}
   * />
   * ```
   *
   * @example
   * ```tsx
   * import Link from "next/link";
   *
   * <FocusedProductLayout
   *   renderBackArrow={(props) => <Link href="/account/settings" {...props} />}
   * />
   * ```
   *
   * @example
   * ```tsx
   * <FocusedProductLayout
   *   renderBackArrow={(props) => <button onClick={() => {}} {...props} />}
   * />
   * ```
   */
  renderBackArrow: (props: { children: ReactNode }) => ReactNode;

  /**
   * Logo to render in the header.
   */
  renderLogo: () => ReactNode;

  /**
   * Page title.
   */
  title: ReactNode;
};

export type FocusedProductLayoutProps = HeaderProps & {
  /**
   * Main content area for the focused product layout. Should be either a
   * `<FocusedProductLayout.Content />` component or a
   * `<FocusedProductLayout.WizardContent />`.
   */
  content: ReactNode;

  /**
   * Optional side panel for the focused product layout. Should be
   * a `<FocusedProductLayout.SidePanel />`.
   */
  sidePanel?: ReactNode;

  /**
   * Position of the side panel.
   */
  sidePanelPosition?: "start" | "end";
};

/**
 * `FocusedProductLayout` defines the areas of a product page in a
 * focused state.
 *
 * @example
 * ```tsx
 * <FocusedProductLayout
 *   helpMenuItems={[
 *     <Menu.Item
 *       key="1"
 *       href="https://www.easypost.com/docs/api"
 *       target="_blank"
 *       rel="noopener"
 *     >
 *       Documentation
 *     </Menu.Item>,
 *   ]}
 *   // Optionally accept a menu handler for menu items that are not links
 *   onHelpMenuAction={(key) => {}}
 *   renderBackArrow={(props) => (
 *     <button {...props} onClick={action("backArrow.onClick pressed")} />
 *   )}
 *   renderLogo={() => <EasyPostFullLogo />}
 *   title="Page Title"
 *   sidePanel={
 *     <FocusedProductLayout.SidePanel>
 *       Side panel content
 *     </FocusedProductLayout.SidePanel>
 *   }
 *   content={
 *     <FocusedProductLayout.Content>
 *       Content
 *     </FocusedProductLayout.Content>
 *   }
 * />
 * ```
 */
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
      <div className={styles.innerContainer}>
        <div className={styles.topBar}>
          <HeaderAtTopOfPage {...headerProps} />
        </div>
        <div className={styles.contentContainer}>
          <HeaderInContentArea {...headerProps} title={title} />
          {content}
        </div>
        {sidePanel}
      </div>
    </div>
  );
}

/**
 * Represents the side panel in a `<FocusedProductLayout />`.
 */
FocusedProductLayout.SidePanel = SidePanel;

/**
 * Represents empty content in a `<FocusedProductLayout />`.
 */
FocusedProductLayout.Content = Content;

/**
 * Represents wizard content in a `<FocusedProductLayout />`.
 */
FocusedProductLayout.WizardContent = WizardContent;
