import ezuiTokens from "@easypost/easy-ui-tokens/js/tokens";
import { useMemo } from "react";
import { pxToRem } from "../utilities/css";

export function useEasyUiSyntaxHighlighterTheme(maxLines?: number) {
  return useMemo(
    () =>
      buildTheme({
        maxLines,
        fontFamily: ezuiTokens["font.family.mono"],
        fontSize: `${pxToRem(14)}rem`,
        base: ezuiTokens["theme.base.color.text.code.base"],
        lineNumber: ezuiTokens["theme.base.color.text.code.lineNumber"],
        comment: ezuiTokens["theme.base.color.text.code.comment"],
        punctuation: ezuiTokens["theme.base.color.text.code.punctuation"],
        property: ezuiTokens["theme.base.color.text.code.property"],
        selector: ezuiTokens["theme.base.color.text.code.selector"],
        operator: ezuiTokens["theme.base.color.text.code.operator"],
        operatorBg: "transparent",
        variable: ezuiTokens["theme.base.color.text.code.variable"],
        function: ezuiTokens["theme.base.color.text.code.function"],
        keyword: ezuiTokens["theme.base.color.text.code.keyword"],
      }),
    [maxLines],
  );
}

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
