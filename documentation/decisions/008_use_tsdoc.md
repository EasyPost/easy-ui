---
status: Accepted
date: 2023-02-28
deciders: stephenjwatkins, OskiTheCoder, ldewald
---

# Use TSDoc to document components

## Context and Problem Statement

Easy UI needs to communicate important information about its components to developers.

## Decision Drivers

- Documentation should be easy to write
- Documentation should be easy to maintain
- Documentation should support long-form text and metadata
- Documentation should support rich formatting (markdown, example code, etc)
- Documentation should be able to meet developers where they are

## Decision Outcome

We will use TSDoc to document our components.

## More Information

It's important for a component's purpose and status be clearly communicated to other developers.

This communication can come in many forms. Often, purpose and status of components are communicated on a design system website or component library Storybook. This is a great starting place for communication, but it's helpful to provide documentation as close to where developers use the components as possible.

Using TSDoc, a documentation standard that's understandable by IDEs, Easy UI can provide documentation on their components that meets developers where they are instead of having to reference a source away from their IDE for important information, such as whether or not its deprecated.

In addition, we can use this same documentation to augment our more general documentation, either in Storybook or on a broader design system website. The goal being to write once and surface where relevant.

### Why TSDoc?

TSDoc is a JSDoc-like standard developed by Microsoft to support documentation in TypeScript codebases. It follows a more clearly defined ruleset than JSDoc and doesn't concern itself with managing types like JSDoc does. Since Easy UI is a TypeScript codebase, TSDoc makes the most sense. TSDoc is closely related to (used in) TypeDoc, which provides a superset on top of TSDoc, and is used for generating documentation from TypeScript codebases.

### What to Communicate?

Easy UI should communicate a summary of the component, including its intent for use and any important information regarding the component itself.

Any long-form remarks and private remarks denoting any important details should also be communicated. Optionally, any private remarks can be noted in the documentation. This may not be stripped out of the final documentation depending on the tooling support.

Examples of the component's use should also be included. Multiple examples are supported

The lifecycle state of the component should be documented if it's anything other than stable. A component's lifecycle follows this sequence: `alpha` -> `stable` -> `deprecated`.

Any domain-specific tagging can be utilized with custom TSDoc tags.

Type information shouldn't be included in the documentation since Easy UI's use of TypeScript provides that information for free.

Props should also be documented with TSDoc syntax, including a brief summary of the prop, any default value, and any lifecycle state other than stable. Properties should be defined in alphabetical order.

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
