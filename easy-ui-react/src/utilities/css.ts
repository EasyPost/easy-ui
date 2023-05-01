import React from "react";
import kebabCase from "lodash/kebabCase";
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
    ? { [`--ezui-c-${componentName}-${kebabCase(componentProp)}`]: value }
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
    token ? `var(--ezui-${tokenSubgroup}-${token})` : undefined,
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
      ? `var(--ezui-t-${kebabCase(tokenSubgroup)}-${kebabCase(token)})`
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
      `var(--ezui-${kebabCase(tokenSubgroup)}-${responsiveProp})`,
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
              ? `var(--ezui-${kebabCase(tokenSubgroup)}-${aliasOrScale})`
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
  responsiveValue?: ResponsiveProp<string>,
) {
  if (!responsiveValue) {
    return {};
  }
  if (typeof responsiveValue === "string") {
    return getComponentToken(
      componentName,
      `${componentProp}-xs`,
      responsiveValue,
    );
  }
  return Object.fromEntries(
    Object.entries(responsiveValue)
      .map(([breakpointAlias, responsiveValue]) => {
        const [tokenEntry] = Object.entries(
          getComponentToken(
            componentName,
            `${componentProp}-${breakpointAlias}`,
            responsiveValue,
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
