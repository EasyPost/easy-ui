import ExpandMoreIcon from "@easypost/easy-ui-icons/ExpandMore400";
import React, { ComponentProps } from "react";
import { useFocusRing } from "react-aria";
import { friendlySnippetLanguageNames } from "../CodeSnippet/SyntaxHighlighter";
import { HorizontalStack } from "../HorizontalStack";
import { Icon } from "../Icon";
import { Text } from "../Text";
import { classNames } from "../utilities/css";

import styles from "./LanguageSelector.module.scss";

export function LanguageSelector({
  value,
  ...restProps
}: ComponentProps<"select"> & { value: string }) {
  const { isFocusVisible, focusProps } = useFocusRing();
  const className = classNames(
    styles.LanguageSelector,
    isFocusVisible && styles.focusVisible,
  );
  return (
    <span className={className}>
      <select {...focusProps} {...restProps} value={value} />
      <span className={styles.facade}>
        <HorizontalStack blockAlign="center" gap="1">
          <Text variant="body1">{friendlySnippetLanguageNames[value]}</Text>
          <Icon symbol={ExpandMoreIcon} />
        </HorizontalStack>
      </span>
    </span>
  );
}
