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

export function getComponentDesignToken(
  componentName: string,
  componentProp: string,
  tokenSubgroup: string,
  token?: string,
) {
  if (!token) {
    return {};
  }
  return {
    [`--ezui-c-${componentName}-${kebabCase(
      componentProp,
    )}`]: `var(--ezui-${tokenSubgroup}-${token})`,
  };
}

export function getComponentThemeToken(
  componentName: string,
  componentProp: string,
  tokenSubgroup: string,
  token?: string,
) {
  if (!token) {
    return {};
  }
  return {
    [`--ezui-c-${componentName}-${kebabCase(
      componentProp,
    )}`]: `var(--ezui-t-${kebabCase(tokenSubgroup)}-${kebabCase(token)})`,
  };
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
    return {
      [`--ezui-c-${componentName}-${kebabCase(
        componentProp,
      )}-xs`]: `var(--ezui-${kebabCase(tokenSubgroup)}-${responsiveProp})`,
    };
  }
  return Object.fromEntries(
    Object.entries(responsiveProp).map(([breakpointAlias, aliasOrScale]) => [
      `--ezui-c-${componentName}-${kebabCase(
        componentProp,
      )}-${breakpointAlias}`,
      `var(--ezui-${kebabCase(tokenSubgroup)}-${aliasOrScale})`,
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
      [`--ezui-c-${componentName}-${kebabCase(componentProp)}-xs`]:
        responsiveValue,
    });
  }
  return sanitizeCustomProperties(
    Object.fromEntries(
      Object.entries(responsiveValue).map(
        ([breakpointAlias, responsiveValue]) => [
          `--ezui-c-${componentName}-${kebabCase(
            componentProp,
          )}-${breakpointAlias}`,
          responsiveValue,
        ],
      ),
    ),
  );
}
