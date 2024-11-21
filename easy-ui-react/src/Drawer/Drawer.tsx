import React, { ElementRef, ReactNode, useMemo, useRef } from "react";
import { useDialog } from "react-aria";
import { classNames } from "../utilities/css";
import { DrawerBanner } from "./DrawerBanner";
import { DrawerBody } from "./DrawerBody";
import { DrawerCloseButton } from "./DrawerCloseButton";
import { DrawerContainer } from "./DrawerContainer";
import {
  DrawerBanneredContentArea,
  DrawerStandaloneContentArea,
} from "./DrawerContentArea";
import { DrawerHeader, DrawerTitle } from "./DrawerHeader";
import { DrawerTrigger } from "./DrawerTrigger";
import { DrawerContext, useDrawerTrigger } from "./context";
import { useIntersectionDetection } from "./useIntersectionDetection";

import styles from "./Drawer.module.scss";

export type DrawerProps = {
  /**
   * Content of the drawer.
   */
  children: ReactNode;
};

export function Drawer(props: DrawerProps) {
  const { children } = props;

  const bodyRef = useRef<ElementRef<"div">>(null);
  const headerInterceptorRef = useRef<ElementRef<"div">>(null);

  const isHeaderStuck = useIntersectionDetection(headerInterceptorRef, bodyRef);

  const dialogRef = React.useRef(null);
  const { dialogProps, titleProps } = useDialog({ role: "dialog" }, dialogRef);

  const context = useMemo(() => {
    return {
      bodyRef,
      headerInterceptorRef,
      isHeaderStuck,
      dialogProps,
      titleProps,
    };
  }, [dialogProps, isHeaderStuck, titleProps]);

  const className = classNames(styles.Drawer);

  return (
    <DrawerContext.Provider value={context}>
      <div {...dialogProps} className={className} ref={dialogRef}>
        {children}
      </div>
    </DrawerContext.Provider>
  );
}

Drawer.Trigger = DrawerTrigger;

Drawer.Header = DrawerHeader;

Drawer.Title = DrawerTitle;

Drawer.Banner = DrawerBanner;

Drawer.Body = DrawerBody;

Drawer.BanneredContentArea = DrawerBanneredContentArea;

Drawer.StandaloneContentArea = DrawerStandaloneContentArea;

Drawer.CloseButton = DrawerCloseButton;

export { DrawerContainer, useDrawerTrigger };
