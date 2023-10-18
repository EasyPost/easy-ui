import { DOMProps } from "@react-types/shared";
import { createContext, useContext } from "react";
import { AriaButtonProps } from "react-aria";
import { OverlayTriggerState } from "react-stately";

export type ProductLayoutContextType = {
  sidebarTriggerState: OverlayTriggerState;
  sidebarTriggerProps: AriaButtonProps;
  sidebarOverlayProps: DOMProps;
};

export const ProductLayoutContext =
  createContext<ProductLayoutContextType | null>(null);

export const useProductLayout = () => {
  const productLayoutContext = useContext(ProductLayoutContext);
  if (!productLayoutContext) {
    throw new Error("useProductLayout must be used within a ProductLayout");
  }
  return productLayoutContext;
};
