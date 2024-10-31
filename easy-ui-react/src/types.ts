import type tokens from "@easypost/easy-ui-tokens/js/tokens";
import React, { ComponentProps } from "react";
import { ResponsiveProp } from "./utilities/css";

export type DesignTokens = typeof tokens;
export type DesignTokenAliases = keyof DesignTokens;

export type Falsy = boolean | undefined | null | 0;

export type Heading = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

/**
 * Tells TypeScript to not try to infer a generic type argument. This is useful
 * for allowing component prop definitions to be optionally extended with an
 * additional set of props.
 */
export type NoInfer<T> = [T][T extends unknown ? 0 : never];

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

export type ThemeTokenAliases = DesignTokenNamespace<"theme.light">;

export type ThemeTokenNamespace<Needle extends string> = Namespace<
  ThemeTokenAliases,
  `${Needle}.`
>;

export type ThemeColorAliases = ThemeTokenNamespace<"color">;

type IconSvgSymbolProps = React.SVGProps<SVGSVGElement> & {
  title?: string;
  titleId?: string;
};

export type IconSymbol =
  | React.FunctionComponent<IconSvgSymbolProps>
  | React.FunctionComponent<ComponentProps<"img">>;

export type SpaceScale = DesignTokenNamespace<"space">;
export type ResponsiveSpaceScale = ResponsiveProp<SpaceScale>;

export type ShadowLevel = DesignTokenNamespace<"shadow.level">;

export type BorderRadius = DesignTokenNamespace<"shape.border_radius">;

type Enumerate<
  N extends number,
  Acc extends number[] = [],
> = Acc["length"] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc["length"]]>;

export type IntRange<F extends number, L extends number> =
  | Exclude<Enumerate<L>, Enumerate<F>>
  | L;
