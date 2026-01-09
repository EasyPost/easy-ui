import React from "react";
import {
  ColorArea as AriaColorArea,
  ColorAreaProps,
} from "react-aria-components";
import { ColorThumb } from "./ColorThumb";

import styles from "./ColorArea.module.scss";

export function ColorArea(props: ColorAreaProps) {
  return (
    <AriaColorArea {...props} className={styles.ColorArea}>
      <ColorThumb />
    </AriaColorArea>
  );
}
