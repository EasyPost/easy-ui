import ContentCopyIcon from "@easypost/easy-ui-icons/ContentCopy";
import React, { useCallback } from "react";
import { mergeProps, useFocus, useHover } from "react-aria";
import { useTooltipTriggerState } from "react-stately";
import { useClipboard } from "use-clipboard-copy";
import { Icon } from "../Icon";
import { Tooltip } from "../Tooltip";

import styles from "./CopyButton.module.scss";

export type CopyButtonProps = {
  text: string;
};

export function CopyButton({ text }: CopyButtonProps) {
  const clipboard = useClipboard({ copiedTimeout: 2000 });
  const { tooltipState, triggerProps } = useCopyButtonTooltipState();
  const handlePress = useCallback(() => {
    clipboard.copy(text);
    tooltipState.close();
  }, [clipboard, text, tooltipState]);
  return (
    <Tooltip
      isOpen={tooltipState.isOpen || clipboard.copied}
      content={clipboard.copied ? "Copied!" : "Copy code block"}
    >
      <button
        className={styles.CopyButton}
        onClick={handlePress}
        {...triggerProps}
      >
        <Icon symbol={ContentCopyIcon} />
      </button>
    </Tooltip>
  );
}

CopyButton.displayName = "CopyButton";

function useCopyButtonTooltipState() {
  const tooltipState = useTooltipTriggerState();
  const { hoverProps } = useHover({
    onHoverStart() {
      tooltipState.open();
    },
    onHoverEnd() {
      tooltipState.close();
    },
  });
  const { focusProps } = useFocus({
    onFocus() {
      tooltipState.open();
    },
    onBlur() {
      tooltipState.close();
    },
  });
  return { triggerProps: mergeProps(hoverProps, focusProps), tooltipState };
}
