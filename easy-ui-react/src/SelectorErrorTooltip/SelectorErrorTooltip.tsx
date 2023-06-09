import ErrorIcon from "@easypost/easy-ui-icons/ErrorFill";
import React from "react";
import { Icon } from "../Icon";
import { Text } from "../Text";
import { Tooltip, TooltipProps } from "../Tooltip";

import styles from "./SelectorErrorTooltip.module.scss";

export function SelectorErrorTooltip(props: Omit<TooltipProps, "children">) {
  return (
    <Tooltip {...props}>
      <span tabIndex={0} className={styles.SelectorErrorTooltip}>
        <Text visuallyHidden>Error</Text>
        <Icon symbol={ErrorIcon} />
      </span>
    </Tooltip>
  );
}
