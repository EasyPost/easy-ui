import { ReactElement } from "react";

import "../../styles/global.css";

export interface ProviderProps {
  children: ReactElement;
}

export function Provider({ children }: ProviderProps) {
  return children;
}
