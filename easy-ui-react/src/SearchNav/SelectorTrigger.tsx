import React, { DOMAttributes } from "react";
import ExpandMore400 from "@easypost/easy-ui-icons/ExpandMore400";
import { FocusableElement } from "@react-types/shared";
import { HiddenSelect } from "react-aria";
import { useInternalSelectContext } from "../Select/SelectContext";
import { UnstyledButton } from "../UnstyledButton";
import { Icon } from "../Icon";
import { classNames } from "../utilities/css";

import styles from "./SelectorTrigger.module.scss";

export type SelectorTriggerProps = {
  /**
   * Field value props.
   */
  valueProps?: DOMAttributes<FocusableElement>;
  /**
   * Label to apply to <HiddenSelect>.
   */
  label: string;
};

export function SelectorTrigger(props: SelectorTriggerProps) {
  const { valueProps, label } = props;
  const { triggerProps, triggerRef, selectState } = useInternalSelectContext();

  return (
    <>
      <HiddenSelect state={selectState} triggerRef={triggerRef} label={label} />
      <UnstyledButton
        {...triggerProps}
        ref={triggerRef}
        className={classNames(styles.triggerBtn)}
        data-testid="trigger"
      >
        <span {...valueProps} className={classNames(styles.text)}>
          {selectState.selectedItem?.rendered}
        </span>
        <Icon symbol={ExpandMore400} size="xs" />
      </UnstyledButton>
    </>
  );
}
