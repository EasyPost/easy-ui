import React from "react";
import type tokens from "@easypost/easy-ui-tokens/js/tokens";
import type { Theme } from "./Theme";

export type DesignTokens = typeof tokens;
export type DesignTokenAliases = keyof DesignTokens;
export type ThemeTokenAliases = keyof Theme;

export type Falsy = boolean | undefined | null | 0;

// Returns types narrowed to a specified prefix and suffix namespace
export type Namespace<
  Set,
  NeedlePrefix extends string,
  NeedleSuffix extends string | void = void,
> = NeedleSuffix extends void
  ? Set extends `${NeedlePrefix}${infer _X}`
    ? _X
    : never
  : Set extends `${NeedlePrefix}${infer _X}${string & NeedleSuffix}`
  ? _X
  : never;

/**
 * Returns types narrowed for the specified namespace and suffix in
 * our tokens file:
 *
 * @example
 * type FontStyles = DesignTokenNamespace<"font-style", "family">
 *   heading1 | heading2 | heading3 ...
 */
export type DesignTokenNamespace<
  NeedlePrefix extends string,
  NeedleSuffix extends void | string = void,
> = NeedleSuffix extends void
  ? Namespace<DesignTokenAliases, `${NeedlePrefix}.`>
  : Namespace<
      DesignTokenAliases,
      `${NeedlePrefix}.`,
      `.${string & NeedleSuffix}`
    >;

export type ThemeTokenNamespace<Needle extends string> = Namespace<
  ThemeTokenAliases,
  `${Needle}.`
>;

type IconSymbolProps = React.SVGProps<SVGSVGElement> & {
  title?: string;
  titleId?: string;
};

export type IconSymbol = React.FunctionComponent<IconSymbolProps>;
