import React, { forwardRef } from "react";
import { Card } from "../Card";
import { SnippetLanguages, SyntaxHighlighter } from "./SyntaxHighlighter";
import { useEasyUiSyntaxHighlighterTheme } from "./theme";

import styles from "./CodeBlock.module.scss";

export type CodeBlockProps = Partial<Omit<HTMLDivElement, "children">> & {
  /**
   * `children` is not supported. Use `code` instead.
   */
  children?: never;

  /**
   * The code snippet to be rendered.
   */
  code: string;

  /**
   * The language of the code snippet.
   */
  language: SnippetLanguages;

  /**
   * Constrains the height of code block to a set number of lines.
   */
  maxLines?: number;

  /**
   * Include line numbers in code block.
   */
  showLineNumbers?: boolean;
};

export const CodeBlock = forwardRef<HTMLDivElement, CodeBlockProps>(
  (props: CodeBlockProps, ref) => {
    const { code, language, maxLines, showLineNumbers } = props;
    const syntaxTheme = useEasyUiSyntaxHighlighterTheme(maxLines);
    return (
      <Card background="primary">
        <div className={styles.CodeBlock} ref={ref}>
          <SyntaxHighlighter
            language={language}
            style={syntaxTheme}
            showLineNumbers={showLineNumbers}
          >
            {code}
          </SyntaxHighlighter>
        </div>
      </Card>
    );
  },
);

CodeBlock.displayName = "CodeBlock";
