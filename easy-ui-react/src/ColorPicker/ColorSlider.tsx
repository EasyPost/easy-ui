import React from "react";
import {
  ColorSlider as AriaColorSlider,
  ColorSliderProps,
  SliderTrack,
} from "react-aria-components";
import { ColorThumb } from "./ColorThumb";

import styles from "./ColorSlider.module.scss";

export function ColorSlider(props: ColorSliderProps) {
  return (
    <AriaColorSlider {...props} className={styles.ColorSlider}>
      <SliderTrack
        className={styles.track}
        style={({ defaultStyle }) => ({
          background: `
            ${defaultStyle.background},
            repeating-conic-gradient(#CCC 0% 25%, white 0% 50%) 50% / 16px 16px
          `,
        })}
        aria-label="Hue slider"
      >
        <ColorThumb className={styles.thumb} />
      </SliderTrack>
    </AriaColorSlider>
  );
}
