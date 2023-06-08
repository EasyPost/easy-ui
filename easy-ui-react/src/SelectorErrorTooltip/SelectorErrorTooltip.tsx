import ErrorIcon from "@easypost/easy-ui-icons/ErrorFill";
import React from "react";
import { Icon } from "../Icon";
import { Tooltip, TooltipProps } from "../Tooltip";

import styles from "./SelectorErrorTooltip.module.scss";

export function SelectorErrorTooltip(props: Omit<TooltipProps, "children">) {
  return (
    <Tooltip {...props}>
      <span
        tabIndex={0}
        className={styles.SelectorErrorTooltip}
        aria-label="Error"
      >
        <Icon symbol={ErrorIcon} />
      </span>
    </Tooltip>
  );
}
