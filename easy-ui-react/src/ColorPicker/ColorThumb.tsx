import React from "react";
import {
  ColorThumb as AriaColorThumb,
  ColorThumbProps,
} from "react-aria-components";
import { classNames } from "../utilities/css";

import styles from "./ColorThumb.module.scss";

export function ColorThumb(
  props: Omit<ColorThumbProps, "className"> & { className?: string },
) {
  return (
    <AriaColorThumb
      {...props}
      className={classNames(styles.ColorThumb, props.className)}
    />
  );
}
