import { mergeRefs, useObjectRef } from "react-aria";
import React, { forwardRef, useContext, useRef } from "react";
import { Card } from "../Card";
import { SnippetLanguage, SyntaxHighlighter } from "./SyntaxHighlighter";
import { useEasyUiSyntaxHighlighterTheme } from "./theme";
import { useScrollbar } from "./useScrollbar";
import { CodeBlockContext } from "../CodeBlock/context";

import styles from "./CodeSnippet.module.scss";

// Line numbers are their own column. Inline numbers sit in the line, so tab
// stops start in the gutter and tab-indented code collapses.
function renderCodeTag({
  children,
  style,
  ...rest
}: React.ComponentPropsWithoutRef<"code">) {
  if (Array.isArray(children) && children.length === 2 && children[0]) {
    const [lineNumbers, lines] = children;
    return (
      <code {...rest} style={{ ...style, display: "flex" }}>
        {lineNumbers}
        <span
          style={{ display: "block", flex: "1 0 auto", tabSize: "inherit" }}
        >
          {lines}
        </span>
      </code>
    );
  }

  return (
    <code {...rest} style={style}>
      {children}
    </code>
  );
}

const lineNumberContainerStyle: React.CSSProperties = {
  flex: "none",
  paddingRight: "1em",
  textAlign: "right",
  userSelect: "none",
};

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
   * The language of the code snippet. `"text"` renders it as plain text,
   * without highlighting.
   *
   * @default "text"
   */
  language?: SnippetLanguage;

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
    const { code, language = "text", maxLines, showLineNumbers } = props;
    const codeBlockRef = useRef<HTMLDivElement | null>(null);
    const mergedRef = useObjectRef(mergeRefs(ref, codeBlockRef));
    const syntaxTheme = useEasyUiSyntaxHighlighterTheme(maxLines);
    useScrollbar(codeBlockRef);
    return (
      <Component background="primary">
        <div
          className={styles.CodeSnippet}
          ref={mergedRef}
          tabIndex={maxLines != null ? 0 : undefined}
        >
          <SyntaxHighlighter
            language={language}
            style={syntaxTheme}
            showLineNumbers={showLineNumbers}
            showInlineLineNumbers={false}
            lineNumberContainerStyle={lineNumberContainerStyle}
            lineNumberStyle={syntaxTheme.linenumber}
            CodeTag={renderCodeTag}
          >
            {code}
          </SyntaxHighlighter>
        </div>
      </Component>
    );
  },
);

CodeSnippet.displayName = "CodeSnippet";
