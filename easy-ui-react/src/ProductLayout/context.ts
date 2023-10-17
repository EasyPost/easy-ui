import { Dispatch, SetStateAction, createContext, useContext } from "react";

export type ProductLayoutContextType = {
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: Dispatch<SetStateAction<boolean>>;
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
