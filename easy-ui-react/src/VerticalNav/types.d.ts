import { AriaLabelingProps } from "@react-types/shared";
import { ReactNode } from "react";

export type BaseVerticalNavProps = AriaLabelingProps & {
  /**
   * List of navigation items to render within the navigation.
   */
  children: ReactNode;

  /**
   * Logo to render at the top of the navigation.
   */
  renderLogo?: () => ReactNode;

  /**
   * Banner to render at the top of the navigation.
   */
  renderBanner?: () => ReactNode;

  /**
   * Supplementary action to render at the bottom of the navigation.
   */
  supplementaryAction?: ReactNode;
};
