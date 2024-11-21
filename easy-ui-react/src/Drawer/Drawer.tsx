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

/**
 * A `Drawer` is a modal that stays on the side of the screen.
 *
 * @remarks
 *  Use a `<Drawer />` when you want to capture information from the user as
 * a part of a concentrated workflow without having them leave the parent page.
 *
 * @example
 * <Drawer.Trigger>
 *   <Button>Open drawer</Button>
 *   <Drawer>
 *     <Drawer.Body>
 *       <Drawer.StandaloneContentArea>
 *         <VerticalStack gap="2">
 *           <HorizontalStack align="space-between" blockAlign="center">
 *             <Drawer.Title>Drawer Title</Drawer.Title>
 *             <Drawer.CloseButton />
 *           </HorizontalStack>
 *           <PlaceholderBox width="100%">Content</PlaceholderBox>
 *         </VerticalStack>
 *       </Drawer.StandaloneContentArea>
 *     </Drawer.Body>
 *   </Drawer>
 * </Drawer.Trigger>
 */
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

/**
 * Represents the trigger for a `<Drawer />`.
 *
 * @remarks
 * A `<Drawer />` must be attached to a focusable trigger element such as a
 * `Button` through the `<Drawer.Trigger />` component. This ensures
 * the trigger and drawer are accessible.
 *
 * `<Drawer.Trigger />` must contain exactly two direct children. The first
 * child must be a focusable trigger such as `Button`. The second child must
 * be either a `Drawer` or a render function that returns a `Drawer`. If using
 * a render function, a `close` argument will be passed to allow for
 * programmatically closing the `Drawer`.
 */
Drawer.Trigger = DrawerTrigger;

/**
 * Represents the header of a `<Drawer />`.
 */
Drawer.Header = DrawerHeader;

/**
 * Represents the title of a `<Drawer />`. This is connected to the drawer via
 * aria-labelledby.
 */
Drawer.Title = DrawerTitle;

/**
 * Represents a banner in a `<Drawer />` header.
 */
Drawer.Banner = DrawerBanner;

/**
 * Represents the main body of a `<Drawer />`.
 */
Drawer.Body = DrawerBody;

/**
 * Represents the content area for a bannered `<Drawer />`.
 */
Drawer.BanneredContentArea = DrawerBanneredContentArea;

/**
 * Represents the content area for a standalone (non-bannered) `<Drawer />`.
 */
Drawer.StandaloneContentArea = DrawerStandaloneContentArea;

/**
 * Represents the preset close button for a `<Drawer />`.
 */
Drawer.CloseButton = DrawerCloseButton;

export { DrawerContainer, useDrawerTrigger };
