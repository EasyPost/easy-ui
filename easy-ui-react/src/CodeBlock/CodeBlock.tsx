import React, { ReactNode, useMemo } from "react";
import { CodeSnippet, CodeSnippetProps } from "../CodeSnippet";
import { SnippetLanguage } from "../CodeSnippet/SyntaxHighlighter";
import { HorizontalStack } from "../HorizontalStack";
import { Text } from "../Text";
import { classNames, variationName } from "../utilities/css";
import { filterChildrenByDisplayName } from "../utilities/react";
import { CopyButton } from "./CopyButton";
import { LanguageMenu } from "./LanguageMenu";
import { CodeBlockContext, useCodeBlock } from "./context";

import styles from "./CodeBlock.module.scss";

export type CodeBlockProps = {
  /**
   * CodeBlock content. This should be a header and collection of snippets.
   */
  children: ReactNode;

  /**
   * Selected language.
   */
  language: SnippetLanguage;

  /**
   * Callback for when the selected language changes.
   */
  onLanguageChange: (language: SnippetLanguage) => void;
};

export type CodeBlockHeaderProps = {
  /**
   * Header title.
   */
  children: ReactNode;

  /**
   * Header color.
   *
   * @default neutral
   */
  color?: "neutral" | "primary" | "secondary";
};

export type CodeBlockSnippetProps = CodeSnippetProps;

function CodeBlockHeader(props: CodeBlockHeaderProps) {
  const { children, color = "neutral" } = props;
  const { snippet, languages, language, onLanguageChange } = useCodeBlock();
  const className = classNames(
    styles.header,
    styles[variationName("color", color)],
  );
  return (
    <div className={className} data-testid="header">
      <HorizontalStack
        align="space-between"
        gap="2"
        wrap={false}
        blockAlign="start"
      >
        <Text variant="subtitle1">{children}</Text>
        <HorizontalStack gap="2" wrap={false}>
          {languages.length > 1 && (
            <>
              <LanguageMenu
                languages={languages}
                language={language}
                onChange={onLanguageChange}
              />
              <span className={styles.divider} />
            </>
          )}
          <CopyButton text={snippet.props.code} />
        </HorizontalStack>
      </HorizontalStack>
    </div>
  );
}

CodeBlockHeader.displayName = "CodeBlock.Header";

function CodeBlockSnippet(props: CodeBlockSnippetProps) {
  return <CodeSnippet {...props} />;
}

CodeBlockSnippet.displayName = "CodeBlock.Snippet";

export function CodeBlock(props: CodeBlockProps) {
  const { children, language, onLanguageChange } = props;

  const snippets = useMemo(() => {
    return filterChildrenByDisplayName(children, "CodeBlock.Snippet");
  }, [children]);

  const headers = useMemo(() => {
    return filterChildrenByDisplayName(children, "CodeBlock.Header");
  }, [children]);

  if (snippets.length === 0) {
    throw new Error("Must supply at least one CodeBlock.Snippet");
  }

  if (headers.length !== 1) {
    throw new Error("Must supply one CodeBlock.Header");
  }

  const snippet =
    snippets.length === 1
      ? snippets[0]
      : snippets.find((snippet) => snippet.props.language === language);

  if (!snippet) {
    throw new Error("No snippet matching supplied language");
  }

  const header = headers[0];

  const languages = useMemo(() => {
    return snippets.map((snippet) => snippet.props.language);
  }, [snippets]);

  const context = useMemo(() => {
    return { languages, snippet, language, onLanguageChange };
  }, [languages, snippet, language, onLanguageChange]);

  return (
    <CodeBlockContext.Provider value={context}>
      <div className={styles.CodeBlock}>
        {header}
        {snippet}
      </div>
    </CodeBlockContext.Provider>
  );
}

CodeBlock.displayName = "CodeBlock";
CodeBlock.Header = CodeBlockHeader;
CodeBlock.Snippet = CodeBlockSnippet;
