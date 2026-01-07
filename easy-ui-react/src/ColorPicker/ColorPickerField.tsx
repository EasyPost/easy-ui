import React from "react";
import {
  Button,
  ColorField,
  ColorPicker,
  ColorSwatch,
  Input,
} from "react-aria-components";
import KeyboardArrowDown from "../../../easy-ui-icons/dist/KeyboardArrowDown";
import { Icon } from "../Icon";
import { ColorPickerProps, ColorPickerTrigger } from "./ColorPicker";

import styles from "./ColorPickerField.module.scss";

export type ColorPickerFieldProps = ColorPickerProps;

export function ColorPickerField(colorPickerProps: ColorPickerFieldProps) {
  return (
    <ColorPicker {...colorPickerProps}>
      <div className={styles.ColorPickerField}>
        <ColorPickerTrigger>
          <Button className={styles.button}>
            <ColorSwatch
              className={styles.swatch}
              style={({ color }) => ({
                background: `
                  linear-gradient(${color}, ${color}),
                  repeating-conic-gradient(#ccc 0% 25%, white 0% 50%) 50% / 16px 16px
                `,
              })}
            />
          </Button>
        </ColorPickerTrigger>
        <ColorField className={styles.field}>
          <Input className={styles.input} />
        </ColorField>
        <div className={styles.icon}>
          <Icon symbol={KeyboardArrowDown} />
        </div>
      </div>
    </ColorPicker>
  );
}
