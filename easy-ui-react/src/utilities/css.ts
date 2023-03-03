import React from "react";
import type { Falsy, TokenNamespace } from "../types";

export type BreakpointsAlias = TokenNamespace<"breakpoint">;
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
  tokenSubgroup: string,
  token?: string,
) {
  if (!token) {
    return {};
  }
  return {
    [`--ezui-c-${componentName}-${componentProp}`]: `var(--ezui-${tokenSubgroup}-${token})`,
  };
}

export function getResponsiveToken(
  componentName: string,
  componentProp: string,
  tokenSubgroup: string,
  responsiveProp?: ResponsiveProp<string>,
) {
  if (!responsiveProp) {
    return {};
  }
  if (typeof responsiveProp === "string") {
    return {
      [`--ezui-c-${componentName}-${componentProp}-xs`]: `var(--ezui-${tokenSubgroup}-${responsiveProp})`,
    };
  }
  return Object.fromEntries(
    Object.entries(responsiveProp).map(([breakpointAlias, aliasOrScale]) => [
      `--ezui-c-${componentName}-${componentProp}-${breakpointAlias}`,
      `var(--ezui-${tokenSubgroup}-${aliasOrScale})`,
    ]),
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
    return sanitizeCustomProperties({
      [`--ezui-c-${componentName}-${componentProp}-xs`]: responsiveValue,
    });
  }
  return sanitizeCustomProperties(
    Object.fromEntries(
      Object.entries(responsiveValue).map(
        ([breakpointAlias, responsiveValue]) => [
          `--ezui-c-${componentName}-${componentProp}-${breakpointAlias}`,
          responsiveValue,
        ],
      ),
    ),
  );
}
