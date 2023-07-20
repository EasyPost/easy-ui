import ContentCopyIcon from "@easypost/easy-ui-icons/ContentCopy";
import React, { useCallback } from "react";
import { useClipboard } from "use-clipboard-copy";
import { Icon } from "../Icon";
import { Tooltip } from "../Tooltip";
import { UnstyledButton } from "../UnstyledButton";

import styles from "./CopyButton.module.scss";

export type CopyButtonProps = {
  text: string;
};

export function CopyButton(props: CopyButtonProps) {
  const { text } = props;

  const clipboard = useClipboard({ copiedTimeout: 2000 });

  const handlePress = useCallback(() => {
    console.log("here");
    clipboard.copy(text);
  }, [clipboard, text]);

  return (
    <Tooltip
      isOpen={clipboard.copied ? true : undefined}
      content={clipboard.copied ? "Copied!" : "Copy code block"}
    >
      <UnstyledButton className={styles.CopyButton} onPress={handlePress}>
        <Icon symbol={ContentCopyIcon} />
      </UnstyledButton>
    </Tooltip>
  );
}

CopyButton.displayName = "CopyButton";
