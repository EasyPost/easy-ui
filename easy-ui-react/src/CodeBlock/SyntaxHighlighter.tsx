import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";

import csharp from "react-syntax-highlighter/dist/esm/languages/prism/csharp";
import shell from "react-syntax-highlighter/dist/esm/languages/prism/shell-session";
import go from "react-syntax-highlighter/dist/esm/languages/prism/go";
import java from "react-syntax-highlighter/dist/esm/languages/prism/java";
import javascript from "react-syntax-highlighter/dist/esm/languages/prism/javascript";
import json from "react-syntax-highlighter/dist/esm/languages/prism/json";
import php from "react-syntax-highlighter/dist/esm/languages/prism/php";
import python from "react-syntax-highlighter/dist/esm/languages/prism/python";
import ruby from "react-syntax-highlighter/dist/esm/languages/prism/ruby";

export type SnippetLanguages =
  | "csharp"
  | "go"
  | "java"
  | "javascript"
  | "json"
  | "php"
  | "python"
  | "ruby"
  | "shell";

const SnippetLanguage = {
  CSHARP: "csharp",
  GO: "go",
  JAVA: "java",
  JAVASCRIPT: "javascript",
  JSON: "json",
  PHP: "php",
  PYTHON: "python",
  RUBY: "ruby",
  SHELL: "shell",
};

SyntaxHighlighter.registerLanguage(SnippetLanguage.CSHARP, csharp);
SyntaxHighlighter.registerLanguage(SnippetLanguage.GO, go);
SyntaxHighlighter.registerLanguage(SnippetLanguage.JAVA, java);
SyntaxHighlighter.registerLanguage(SnippetLanguage.JAVASCRIPT, javascript);
SyntaxHighlighter.registerLanguage(SnippetLanguage.JSON, json);
SyntaxHighlighter.registerLanguage(SnippetLanguage.PHP, php);
SyntaxHighlighter.registerLanguage(SnippetLanguage.PYTHON, python);
SyntaxHighlighter.registerLanguage(SnippetLanguage.RUBY, ruby);
SyntaxHighlighter.registerLanguage(SnippetLanguage.SHELL, shell);

export { SyntaxHighlighter, SnippetLanguage };

export type SyntaxHighlighterThemeConfig = {
  maxLines?: number;
  fontFamily: string;
  fontSize: string;
  base: string;
  lineNumber: string;
  comment: string;
  punctuation: string;
  property: string;
  selector: string;
  operator: string;
  operatorBg: string;
  variable: string;
  function: string;
  keyword: string;
};

export function buildTheme(
  config: SyntaxHighlighterThemeConfig,
): Record<string, React.CSSProperties> {
  return {
    'code[class*="language-"]': {
      color: config.base,
      fontFamily: config.fontFamily,
      textAlign: "left",
      whiteSpace: "pre",
      wordSpacing: "normal",
      wordBreak: "normal",
      wordWrap: "normal",
      lineHeight: "1.5",
      fontSize: config.fontSize,
      MozTabSize: "4",
      OTabSize: "4",
      tabSize: "4",
      WebkitHyphens: "none",
      MozHyphens: "none",
      msHyphens: "none",
      hyphens: "none",
    },
    'pre[class*="language-"]': {
      color: config.base,
      fontFamily: config.fontFamily,
      textAlign: "left",
      whiteSpace: "pre",
      wordSpacing: "normal",
      wordBreak: "normal",
      wordWrap: "normal",
      lineHeight: "1.5",
      fontSize: config.fontSize,
      MozTabSize: "4",
      OTabSize: "4",
      tabSize: "4",
      WebkitHyphens: "none",
      MozHyphens: "none",
      msHyphens: "none",
      hyphens: "none",
      margin: "0",
      overflow: "auto",
      background: "inherit",
      display: "-webkit-box",
      WebkitLineClamp: `${config.maxLines}`,
      WebkitBoxOrient: "vertical",
      width: "100%",
    },
    'pre[class*="language-"]::-moz-selection': {
      textShadow: "none",
      background: "inherit",
    },
    'pre[class*="language-"] ::-moz-selection': {
      textShadow: "none",
      background: "inherit",
    },
    'code[class*="language-"]::-moz-selection': {
      textShadow: "none",
      background: "inherit",
    },
    'code[class*="language-"] ::-moz-selection': {
      textShadow: "none",
      background: "inherit",
    },
    'pre[class*="language-"]::selection': {
      textShadow: "none",
      background: "inherit",
    },
    'pre[class*="language-"] ::selection': {
      textShadow: "none",
      background: "inherit",
    },
    'code[class*="language-"]::selection': {
      textShadow: "none",
      background: "inherit",
    },
    'code[class*="language-"] ::selection': {
      textShadow: "none",
      background: "inherit",
    },
    linenumber: {
      color: config.lineNumber,
      fontStyle: "none",
    },
    ".namespace": {
      opacity: 0.7,
    },
    comment: {
      color: config.comment,
    },
    prolog: {
      color: config.comment,
    },
    doctype: {
      color: config.comment,
    },
    cdata: {
      color: config.comment,
    },
    punctuation: {
      color: config.punctuation,
    },
    property: {
      color: config.property,
    },
    tag: {
      color: config.property,
    },
    boolean: {
      color: config.property,
    },
    number: {
      color: config.property,
    },
    constant: {
      color: config.property,
    },
    symbol: {
      color: config.property,
    },
    deleted: {
      color: config.property,
    },
    selector: {
      color: config.selector,
    },
    "attr-name": {
      color: config.selector,
    },
    string: {
      color: config.selector,
    },
    char: {
      color: config.selector,
    },
    builtin: {
      color: config.selector,
    },
    inserted: {
      color: config.selector,
    },
    operator: {
      color: config.operator,
      background: config.operatorBg,
    },
    entity: {
      color: config.operator,
      background: config.operatorBg,
      cursor: "help",
    },
    url: {
      color: config.operator,
      background: config.operatorBg,
    },
    ".language-css .token.string": {
      color: config.operator,
      background: config.operatorBg,
    },
    ".style .token.string": {
      color: config.operator,
      background: config.operatorBg,
    },
    atrule: {
      color: config.keyword,
    },
    "attr-value": {
      color: config.keyword,
    },
    keyword: {
      color: config.keyword,
    },
    function: {
      color: config.function,
    },
    regex: {
      color: config.variable,
    },
    important: {
      color: config.variable,
      fontWeight: "bold",
    },
    variable: {
      color: config.variable,
    },
    bold: {
      fontWeight: "bold",
    },
    italic: {
      fontStyle: "italic",
    },
  };
}
