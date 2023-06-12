import ezuiTokens from "@easypost/easy-ui-tokens/js/tokens";
import React, { useMemo } from "react";
import { Card } from "../Card";
import { pxToRem } from "../utilities/css";
import {
  SnippetLanguages,
  SyntaxHighlighter,
  buildTheme,
} from "./SyntaxHighlighter";

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

export const CodeBlock = React.forwardRef<HTMLDivElement, CodeBlockProps>(
  (props, ref) => {
    const { code, language, maxLines, showLineNumbers } = props;
    const syntaxTheme = useMemo(
      () =>
        buildTheme({
          maxLines,
          fontFamily: ezuiTokens["font.family.mono"],
          fontSize: `${pxToRem(14)}rem`,
          base: ezuiTokens["color.blue.800"],
          lineNumber: ezuiTokens["color.gray.500"],
          comment: ezuiTokens["color.gray.400"],
          punctuation: ezuiTokens["color.gray.700"],
          property: ezuiTokens["color.red.600"],
          selector: ezuiTokens["color.green.600"],
          operator: ezuiTokens["color.yellow.800"],
          operatorBg: ezuiTokens["color.white"],
          variable: ezuiTokens["color.yellow.700"],
          function: ezuiTokens["color.red.500"],
          keyword: ezuiTokens["color.blue.500"],
        }),
      [maxLines],
    );
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
