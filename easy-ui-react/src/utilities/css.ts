import React from "react";
import type { Falsy, DesignTokenNamespace } from "../types";

export type BreakpointsAlias = DesignTokenNamespace<"breakpoint">;
export type ResponsiveProp<T> = T | { [Breakpoint in BreakpointsAlias]?: T };

export function classNames(...classes: (string | Falsy)[]) {
  return classes.filter(Boolean).join(" ");
}

export function variationName(name: string, value: string) {
  return `${name}${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}

export function sanitizeCustomProperties(styles: React.CSSProperties) {
  const nonNullValues = Object.entries(styles).filter(
    ([, value]) => value != null,
  );
  return nonNullValues.length ? Object.fromEntries(nonNullValues) : undefined;
}

export function getComponentToken(
  componentName: string,
  componentProp: string,
  value?: string,
) {
  return value
    ? {
        [`--ezui-c-${tokenSafeKebabCase(componentName)}-${tokenSafeKebabCase(
          componentProp,
        )}`]: value,
      }
    : {};
}

export function getComponentDesignToken(
  componentName: string,
  componentProp: string,
  tokenSubgroup: string,
  token?: string,
) {
  return getComponentToken(
    componentName,
    componentProp,
    token
      ? `var(--ezui-${tokenSafeKebabCase(tokenSubgroup)}-${tokenSafeKebabCase(
          token,
        )})`
      : undefined,
  );
}

export function getComponentThemeToken(
  componentName: string,
  componentProp: string,
  tokenSubgroup: string,
  token?: string,
) {
  return getComponentToken(
    componentName,
    componentProp,
    token
      ? `var(--ezui-${tokenSafeKebabCase(tokenSubgroup)}-${tokenSafeKebabCase(
          token,
        )})`
      : undefined,
  );
}

export function getResponsiveDesignToken(
  componentName: string,
  componentProp: string,
  tokenSubgroup: string,
  responsiveProp?: ResponsiveProp<string>,
) {
  if (!responsiveProp) {
    return {};
  }
  if (typeof responsiveProp === "string") {
    return getComponentToken(
      componentName,
      `${componentProp}-xs`,
      `var(--ezui-${tokenSafeKebabCase(tokenSubgroup)}-${tokenSafeKebabCase(
        responsiveProp,
      )})`,
    );
  }
  return Object.fromEntries(
    Object.entries(responsiveProp)
      .map(([breakpointAlias, aliasOrScale]) => {
        const [tokenEntry] = Object.entries(
          getComponentToken(
            componentName,
            `${componentProp}-${breakpointAlias}`,
            aliasOrScale
              ? `var(--ezui-${tokenSafeKebabCase(
                  tokenSubgroup,
                )}-${tokenSafeKebabCase(aliasOrScale)})`
              : undefined,
          ),
        );
        return tokenEntry;
      })
      .filter((e) => Boolean(e)),
  );
}

export function getResponsiveValue(
  componentName: string,
  componentProp: string,
  responsiveValue?: ResponsiveProp<string | number>,
) {
  if (!responsiveValue) {
    return {};
  }
  if (
    typeof responsiveValue === "string" ||
    typeof responsiveValue === "number"
  ) {
    return getComponentToken(
      componentName,
      `${componentProp}-xs`,
      addPxUnitToNumber(responsiveValue),
    );
  }
  return Object.fromEntries(
    Object.entries(responsiveValue)
      .map(([breakpointAlias, responsiveValue]) => {
        const [tokenEntry] = Object.entries(
          getComponentToken(
            componentName,
            `${componentProp}-${breakpointAlias}`,
            addPxUnitToNumber(responsiveValue),
          ),
        );
        return tokenEntry;
      })
      .filter((e) => Boolean(e)),
  );
}

export function pxToRem(px: string | number) {
  return parseInt(String(px), 10) / 16;
}

export function addPxUnitToNumber(px: string | number) {
  return typeof px === "number" ? `${px}px` : px;
}

/**
 * Converts a string to kebab case in a manner safe for dealing with tokens.
 *
 * @remarks
 * Most kebab case conversions separate numbers whereas our Style Dictionary
 * only replaces underscores and dots with kebabs.
 */
export function tokenSafeKebabCase(str: string) {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_\.]+/g, "-")
    .toLowerCase();
}

// TODO: Remove these once they're removed from the consumers
export function backwardsCompatibleColorToken(token?: string) {
  const oldTokens = {
    primary: "primary.800",
    subdued: "neutral.600",
    danger: "negative.600",
    action: "primary.500",
    disabled: "neutral.300",
    inverse: "neutral.000",
    "gray.bold": "neutral.800",
    "gray.resting": "neutral.500",
    "code.selector": "positive.700",
    "primary-inverse": "neutral.000",
  };
  if (token && oldTokens.hasOwnProperty(token)) {
    return oldTokens[token as keyof typeof oldTokens];
  }
  return token;
}
