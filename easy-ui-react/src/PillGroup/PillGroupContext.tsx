import { createContext, useContext } from "react";
import { PillBackground } from "./PillGroup";

type InternalPillGroupContextType = {
  background: PillBackground;
};

export const InternalPillGroupContext =
  createContext<InternalPillGroupContextType | null>(null);

export function useInternalPillGroupContext() {
  const pillGroupContext = useContext(InternalPillGroupContext);
  if (!pillGroupContext) {
    throw new Error(
      "InternalPillGroupContext must be used inside a <PillGroup />",
    );
  }
  return pillGroupContext;
}
