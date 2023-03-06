import React from "react";
import type tokens from "@easypost/easy-ui-tokens/js/tokens";

export type DesignTokens = typeof tokens;
export type DesignTokenAliases = keyof DesignTokens;

export type Falsy = boolean | undefined | null | 0;

// Returns types narrowed to a specified key namespace
export type Namespace<
  Set,
  Needle extends string,
> = Set extends `${Needle}${infer _X}` ? _X : never;

// Returns types narrowed for the specified namespace in our tokens file:
//
// type BreakpointsAlias = TokenNamespace<"breakpoint">
//   xs | sm | md ...
export type TokenNamespace<Needle extends string> = Namespace<
  DesignTokenAliases,
  `${Needle}-`
>;

type IconSymbolProps = React.SVGProps<SVGSVGElement> & {
  title?: string;
  titleId?: string;
};

export type IconSymbol = React.FunctionComponent<IconSymbolProps>;
