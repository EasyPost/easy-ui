import React, { useContext } from "react";
import {
  ColorPicker as AriaColorPicker,
  ColorPickerProps as AriaColorPickerProps,
  ColorPickerStateContext,
  DialogTrigger,
  Popover,
} from "react-aria-components";
import { ColorArea } from "./ColorArea";
import { ColorSlider } from "./ColorSlider";

import styles from "./ColorPicker.module.scss";

export type ColorPickerProps = {
  /** The current value (controlled). */
  value?: AriaColorPickerProps["value"];
  /** The default value (uncontrolled). */
  defaultValue?: AriaColorPickerProps["defaultValue"];
  /** Handler that is called when the value changes. */
  onChange?: AriaColorPickerProps["onChange"];
  /** The children of the component. A function may be provided to alter the children based on component state. */
  children: AriaColorPickerProps["children"];
};

/**
 * A `<ColorPicker />` allows users to select a color with a color picker.
 *
 * @example
 * <ColorPicker>
 *   <ColorPickerTrigger>
 *     <Button>Pick a color</Button>
 *   </ColorPickerTrigger>
 * </ColorPicker>
 */
export function ColorPicker(props: ColorPickerProps) {
  return <AriaColorPicker {...props} />;
}

function ColorPickerTrigger({ children }: { children: React.ReactNode }) {
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

/**
 * Attaches a `<ColorPicker />` to a pressiable trigger element.
 */
ColorPicker.Trigger = ColorPickerTrigger;

/**
 * Returns the internal state of the nearest `<ColorPicker />` component.
 */
export function useColorPickerState() {
  const colorPickerStateContext = useContext(ColorPickerStateContext);
  if (!colorPickerStateContext) {
    throw new Error(
      "useColorPickerState must be used within a ColorPicker component",
    );
  }
  return colorPickerStateContext;
}
