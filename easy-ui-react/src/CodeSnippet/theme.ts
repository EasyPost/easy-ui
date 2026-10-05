import ezuiTokens from "@easypost/easy-ui-tokens/js/tokens";
import { useMemo } from "react";
import { pxToRem } from "../utilities/css";

/** Unitless line height shared by the `pre` and `code` elements. */
const LINE_HEIGHT = 1.5;

/** Bottom padding on the `pre`, offset by an equal negative margin. */
const BLOCK_PADDING_BOTTOM = 4;

export function useEasyUiSyntaxHighlighterTheme(maxLines?: number) {
  return useMemo(
    () =>
      buildTheme({
        maxLines,
        fontFamily: ezuiTokens["font.family.mono"],
        fontSize: `${pxToRem(14)}rem`,
        base: ezuiTokens["theme.light.color.primary.800"],
        lineNumber: ezuiTokens["theme.light.color.neutral.600"],
        comment: ezuiTokens["theme.light.color.neutral.400"],
        punctuation: ezuiTokens["theme.light.color.neutral.700"],
        property: ezuiTokens["theme.light.color.negative.700"],
        selector: ezuiTokens["theme.light.color.positive.700"],
        operator: ezuiTokens["theme.light.color.warning.800"],
        operatorBg: "transparent",
        variable: ezuiTokens["theme.light.color.warning.700"],
        function: ezuiTokens["theme.light.color.negative.600"],
        keyword: ezuiTokens["theme.light.color.primary.500"],
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
      lineHeight: `${LINE_HEIGHT}`,
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
      lineHeight: `${LINE_HEIGHT}`,
      fontSize: config.fontSize,
      MozTabSize: "4",
      OTabSize: "4",
      tabSize: "4",
      WebkitHyphens: "none",
      MozHyphens: "none",
      msHyphens: "none",
      hyphens: "none",
      margin: "0",
      background: "inherit",
      display: "-webkit-box",
      paddingBottom: BLOCK_PADDING_BOTTOM,
      marginBottom: -BLOCK_PADDING_BOTTOM,
      ...(config.maxLines && {
        position: "relative",
        paddingRight: 4,
        // cap the height to `maxLines` line boxes rather than using
        // `-webkit-line-clamp`, which renders an ellipsis on the last visible
        // line and reads as though the code itself were truncated. `em` here
        // resolves against this element's own font size, so one line box is
        // `LINE_HEIGHT` em; the padding is added back since `box-sizing` is
        // `border-box` and would otherwise eat into the last line.
        maxHeight: `calc(${config.maxLines * LINE_HEIGHT}em + ${BLOCK_PADDING_BOTTOM}px)`,
        overflow: "auto",
      }),
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
