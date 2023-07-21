import ExpandMoreIcon from "@easypost/easy-ui-icons/ExpandMore400";
import React, { useCallback } from "react";
import {
  SnippetLanguage,
  friendlySnippetLanguageNames,
} from "../CodeSnippet/SyntaxHighlighter";
import { HorizontalStack } from "../HorizontalStack";
import { Icon } from "../Icon";
import { Menu } from "../Menu";
import { Text } from "../Text";
import { UnstyledButton } from "../UnstyledButton";

import styles from "./LanguageMenu.module.scss";

export type LanguageMenuProps = {
  /**
   * List of languages.
   */
  languages: SnippetLanguage[];

  /**
   * Selected language.
   */
  language: SnippetLanguage;

  /**
   * Callback for when the selected language changes.
   */
  onChange: (language: SnippetLanguage) => void;
};

export function LanguageMenu(props: LanguageMenuProps) {
  const { languages, language, onChange } = props;
  const handleMenuAction = useCallback(
    (key: React.Key) => {
      const language = key as SnippetLanguage;
      onChange(language);
    },
    [onChange],
  );
  return (
    <Menu>
      <Menu.Trigger>
        <UnstyledButton className={styles.button}>
          <HorizontalStack blockAlign="center" gap="1">
            <Text variant="body1">
              {friendlySnippetLanguageNames[language]}
            </Text>
            <Icon symbol={ExpandMoreIcon} />
          </HorizontalStack>
        </UnstyledButton>
      </Menu.Trigger>
      <Menu.Overlay maxItemsUntilScroll={Infinity} onAction={handleMenuAction}>
        {languages.map((language) => (
          <Menu.Item key={language}>
            {friendlySnippetLanguageNames[language]}
          </Menu.Item>
        ))}
      </Menu.Overlay>
    </Menu>
  );
}
