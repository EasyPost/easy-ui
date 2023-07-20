import { mergeRefs } from "@react-aria/utils";
import React, { forwardRef, useContext, useRef } from "react";
import { Card } from "../Card";
import { SnippetLanguage, SyntaxHighlighter } from "./SyntaxHighlighter";
import { useEasyUiSyntaxHighlighterTheme } from "./theme";
import { useScrollbar } from "./useScrollbar";
import { CodeBlockContext } from "../CodeBlock/context";

import styles from "./CodeSnippet.module.scss";

export type CodeSnippetProps = Partial<Omit<HTMLDivElement, "children">> & {
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
  language: SnippetLanguage;

  /**
   * Constrains the height of code block to a set number of lines.
   */
  maxLines?: number;

  /**
   * Include line numbers in code block.
   */
  showLineNumbers?: boolean;
};

/**
 * A display element for readable blocks of code.
 *
 * @remarks
 * Use a Code Block to improve readability of embedded code samples with
 * syntax highlighting and automatic line numbering.
 *
 * @example
 * ```tsx
 * <CodeSnippet
 *   code={`console.log("Hello world");`}
 *   language="javascript"
 * />
 * ```
 *
 * @example
 * _Line numbers:_
 * ```tsx
 * <CodeSnippet
 *   code={`console.log("Hello world");`}
 *   language="javascript"
 *   showLineNumbers
 * />
 * ```
 *
 * @example
 * _Max lines:_
 * ```tsx
 * <CodeSnippet
 *   code={`console.log("Hello world");`}
 *   language="javascript"
 *   maxLines={8}
 * />
 * ```
 */
export const CodeSnippet = forwardRef<HTMLDivElement, CodeSnippetProps>(
  (props: CodeSnippetProps, ref) => {
    const codeBlockContext = useContext(CodeBlockContext);
    const isWithinCodeBlock = Boolean(codeBlockContext);
    const Component = isWithinCodeBlock ? Card.Area : Card;
    const { code, language, maxLines, showLineNumbers } = props;
    const codeBlockRef = useRef<HTMLDivElement | null>(null);
    const syntaxTheme = useEasyUiSyntaxHighlighterTheme(maxLines);
    useScrollbar(codeBlockRef);
    return (
      <Component background="primary">
        <div
          className={styles.CodeSnippet}
          ref={mergeRefs(ref, codeBlockRef)}
          tabIndex={maxLines != null ? 0 : undefined}
        >
          <SyntaxHighlighter
            language={language}
            style={syntaxTheme}
            showLineNumbers={showLineNumbers}
          >
            {code}
          </SyntaxHighlighter>
        </div>
      </Component>
    );
  },
);

CodeSnippet.displayName = "CodeSnippet";
