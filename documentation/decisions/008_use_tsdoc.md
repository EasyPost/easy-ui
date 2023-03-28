---
status: Accepted
date: 2023-03-28
deciders: stephenjwatkins, OskiTheCoder, ldewald
---

# Use TSDoc to document components for developers

## Context and Problem Statement

Component library documentation comes in many forms. Typically, a thorough level of documentation for components are communicated on design system websites. While this is an important channel of communication for stakeholders in general, it's helpful to provide standardized documentation closer to implementors.

Apart from increasing awareness of a component's intent to developers, it's important to ensure that critical metadata is standardized across the project. Details such as the lifecycle state of a component is information important to mark and surface in appropriate channels.

Easy UI needs to facilitate communicating intent-of-use and critical lifecycle state to implementors of the library.

## Decision Drivers

- Documentation should be easy to write
- Documentation should be easy to maintain
- Documentation should support long-form text and metadata
- Documentation should support rich formatting (markdown, example code, etc)
- Documentation should support domain-specific extension
- Documentation should be able to meet developers where they are

## Decision Outcome

We will use TSDoc to document our components for developers.

## More Information

TSDoc is a JSDoc-like standard developed by Microsoft to support documentation in TypeScript codebases. It follows a more clearly defined ruleset than JSDoc without concerning itself with types. Since Easy UI is a TypeScript project, TSDoc is a natural choice. A related project, TypeDoc, is a superset of TSDoc used for generating documentation from TypeScript and TSDoc projects.

Using TSDoc, implementors of Easy UI get documentation of components for free through built-in parsers in IDEs. This channel of documentation will reduce distance between the source and implementation, providing a safer, more robust path for implementors.

On top of providing documentation for developers out of the box through IDEs, various tooling exists for TSDoc to parse its grammer and generate documentation. This tooling could be used to parse Easy UI for surfacing on Storybook and other communication channels.

### What to Communicate

Easy UI should communicate a component's intent-for-use and any critical information for developers.

- Summary of a component's intent-of-use
- Any long-form remarks denoting any important details about the component
- Examples of a component's usage
- Any non-stable lifecycle state of the component—`@alpha` or `@deprecated`

Given that Easy UI is a TypeScript project, type information should not be included in TSDoc.

Properties of components should also be documented in TSDoc syntax. Properties should include a summary of the property, any default value for the property, and any non-stable lifecycle state of the property. Properties should be listed in alphabetical order.

### Documenting Easy UI Components

````tsx
type ComponentProps = {
  /**
   * A brief summary of property1
   */
  property1: string;
  /**
   * A brief summary of property2
   * @default true
   */
  property2?: boolean;
  /**
   * A brief summary of property3
   * @deprecated Alternative option
   */
  property3: "a" | "b";
};

/**
 * A summary of Component describing the component's purpose.
 *
 * @alpha
 * @deprecated A short sentence describing the alternative
 *
 * @remarks
 * Optionally, provide any detailed information regarding any nuance using
 * the component.
 *
 * @privateRemarks
 * Optionally, provide any information internally meaningful to the project,
 * not meant for public consumption, though this can't be guaranteed.
 *
 * @example
 * Here's an example using Component as "a":
 * ```tsx
 *  <Component
 *    property1="Message"
 *    property2={false}
 *    property3="a"
 *  />
 * ```
 *
 * @example
 * Here's an example using Component as "b":
 * ```tsx
 *  <Component
 *    property1="Message"
 *    property2
 *    property3="b"
 *  />
 * ```
 *
 */
function Component(props: ComponentProps) {
  return <>{/* Implementation */</>
}
````

### Custom tags

TSDoc supports domain-specific tags. While Easy UI isn't using any custom tags initially, we might want custom tags in the future.

As an example, to add a tag that marks a component needing accessibility review, one could modify the `tsdoc.json` config at the root of the project to let TSDoc know of the custom tag.

```
{
  "$schema": "https://developer.microsoft.com/json-schemas/tsdoc/v0/tsdoc.schema.json",
  "tagDefinitions": [
    {
      "tagName": "@needsAccessibilityReview",
      "syntaxKind": "modifier"
    }
  ]
}
```

This tag could then be used in component documentation.

```tsx
/**
 * A summary of Component describing the component's purpose.
 *
 * @needsAccessibilityReview
 */
function Component(props: ComponentProps) {
  return <>{/* Implementation */</>
}
```

Refer to the [TSDoc config reference](https://tsdoc.org/pages/packages/tsdoc-config/) for more information.
