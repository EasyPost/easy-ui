import React, { ReactNode } from "react";
import { useScrollbar } from "../utilities/useScrollbar";
import { useInternalPopoverOverlayContext } from "./PopoverContext";

import styles from "./Popover.module.scss";

export type PopoverBodyProps = {
  /** The content of the popover body. */
  children: ReactNode;
};

export function PopoverBody(props: PopoverBodyProps) {
  const { children } = props;
  const { bodyRef } = useInternalPopoverOverlayContext();
  useScrollbar(bodyRef, "ezui-os-theme-overlay");
  return (
    <div
      className={styles.body}
      ref={bodyRef}
      data-overlayscrollbars-initialize
    >
      {children}
    </div>
  );
}
