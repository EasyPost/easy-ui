import React from "react";
import {
  ColorPicker as AriaColorPicker,
  ColorPickerProps as AriaColorPickerProps,
  DialogTrigger,
  Popover,
} from "react-aria-components";
import { ColorArea } from "./ColorArea";
import { ColorSlider } from "./ColorSlider";

import styles from "./ColorPicker.module.scss";

export type ColorPickerProps = AriaColorPickerProps;

export function ColorPicker(props: ColorPickerProps) {
  return <AriaColorPicker {...props} />;
}

export function ColorPickerTrigger({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DialogTrigger>
      {children}
      <Popover placement="bottom start" className={styles.popover}>
        <ColorArea
          colorSpace="hsb"
          xChannel="saturation"
          yChannel="brightness"
        />
        <ColorSlider colorSpace="hsb" channel="hue" />
      </Popover>
    </DialogTrigger>
  );
}
