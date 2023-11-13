import { createContext, useContext } from "react";

export type VerticalNavType = "list" | "tree";

export const VerticalNavTypeContext = createContext<VerticalNavType | null>(
  null,
);

export const useVerticalNavType = () => {
  const verticalNavTypeContext = useContext(VerticalNavTypeContext);
  if (!verticalNavTypeContext) {
    throw new Error("useVerticalNavType must be used within a VerticalNav");
  }
  return verticalNavTypeContext;
};
