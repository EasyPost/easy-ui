import { FocusableElement } from "@react-types/shared";
import { DOMAttributes, RefObject, createContext, useContext } from "react";
import { OverlayTriggerState } from "react-stately";

export type DrawerContextType = {
  dialogProps: DOMAttributes<FocusableElement>;
  titleProps: DOMAttributes<FocusableElement>;
  isHeaderStuck: boolean;
  bodyRef: RefObject<HTMLDivElement>;
  headerInterceptorRef: RefObject<HTMLDivElement>;
};

type DrawerTriggerContextType = {
  isDismissable: boolean;
  state: OverlayTriggerState;
};

export const DrawerContext = createContext<DrawerContextType | null>(null);

export const useDrawerContext = () => {
  const drawerContext = useContext(DrawerContext);
  if (!drawerContext) {
    throw new Error("useDrawer must be used within a Drawer");
  }
  return drawerContext;
};

export const DrawerTriggerContext =
  createContext<DrawerTriggerContextType | null>(null);

export const useDrawerTriggerContext = () => {
  const drawerTriggerContext = useContext(DrawerTriggerContext);
  if (!drawerTriggerContext) {
    throw new Error("useDrawerTrigger must be used within a DrawerTrigger");
  }
  return drawerTriggerContext;
};

export const useDrawerTrigger = () => {
  const drawerTriggerContext = useDrawerTriggerContext();
  return drawerTriggerContext.state;
};
