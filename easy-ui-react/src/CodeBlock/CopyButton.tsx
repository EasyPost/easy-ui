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
  const content = clipboard.copied ? "Copied!" : "Copy code block";
  return (
    <Tooltip
      key={content}
      isOpen={tooltipState.isOpen || clipboard.copied}
      content={content}
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
    onHoverChange(isHovering) {
      tooltipState[isHovering ? "open" : "close"]();
    },
  });
  const { focusProps } = useFocus({
    onFocusChange(isFocused) {
      tooltipState[isFocused ? "open" : "close"]();
    },
  });
  return { triggerProps: mergeProps(hoverProps, focusProps), tooltipState };
}
