import { AriaLabelingProps } from "@react-types/shared";
import { ReactNode } from "react";

export type BaseVerticalNavProps = AriaLabelingProps & {
  children: ReactNode;
  renderLogo?: () => ReactNode;
  renderBanner?: () => ReactNode;
  supplementaryAction?: ReactNode;
};
