---
status: Accepted
date: 2023-02-09
deciders: stephenjwatkins, OskiTheCoder, kevinalexliu
---

# Use Design Tokens

## Context and Problem Statement

Constructing and maintaining cohesive designs is a challenge. Foundational elements such as spacing, color, and typography quickly diverge when underlying values are not catalogued and reused appropriately.

Design tokens are a mechanism for representing shared data values across a design system to prevent design divergence. These values can be anything — spacing, color, typography, shadows, animation, etc. They're used in place of hard-coded values to ensure flexibility and unity across all product experiences.

## Decision Outcome

Design tokens will be used to support the creation of a flexible and consistent design system. Style Dictionary will be the tool used to facilitate their adoption and management.

## More Information

Design tokens are an abstraction of design decisions made to construct and maintain a design system. They can represent anything defined by design: a color as an RGB value, an opacity as a number, an animation ease as Bezier coordinates, a spacing defined as part of a scale.

Design tokens are directly integrated into component libraries and cover the options of typography, color themes, spacing scales, component states, and more.

### Common Design Tokens

Design tokens can be any value defined by design. It's generally common to see the following classes of values stored as design tokens:

- Colors
- Spacing Scale
- Font Styles
- Border Configurations
- Dimension Configurations
- Shadow Configurations
- Animation Configurations
- Opacity Configurations
- Z-Indices

### Types of Tokens

Design tokens follow three levels of abstraction that reflect the chain of systematic decisions made, from high-level visual styles to specific component properties. These layers of abstraction are an important aspect to cultivating a functional design system:

#### Global Tokens

Global tokens are the primitive values in the design language, represented by context-agnostic names. Our color palette, animation, typography, and dimension values are all recorded as global tokens. These are inherited by all other token types.

#### Alias Tokens

Alias tokens relate to a specific context or abstraction. Aliases help communicate the intended purpose of a token, and are effective when a value with a single intent will appear in multiple places. Alias tokens inherit from global tokens.

#### Component-Specific Tokens

Component-specific tokens are an exhaustive representation of every value associated with a component. They inherit from alias tokens, but are named in a way that allows engineering teams to be as specific as possible in applying tokens in component development.

#### Example

```
/* Global Token */
--blue-400: #2680EB;

/* Alias Token */
--cta-background-color: --blue-400;

/* Component-Specific Token */
--button-cta-background-color: --cta-background-color;
```

### Guidelines

#### Use global tokens for low-level primitives

Global tokens are named references for primitive design values and and the building blocks of a design language. They should be used by alias tokens in place of hard-coded values. Because global tokens lack context, they should only be used directly by alias tokens.

#### Use alias tokens for associated meaning

Alias tokens are the type of tokens to use when building your product with design tokens. Aliases are like a “Rosetta Stone” for understanding the design system, and they help to associate meaning, context, and/or intent to the design tokens you’re applying to your product. Using aliases is a good way to ensure that your product can evolve alongside the evolution of the design system, and to minimize future maintenance for your product.

#### Use component tokens for their respective component

When building components, use component-specific tokens. This ensures that as a component’s design evolves, you won’t have to retrace any higher-level design decisions that informed the updates. Component-specific tokens should reference alias tokens. It’s not recommended to use component-specific tokens interchangeably with other components, unless one is derivative of the other.

### Implementation

When managing user experiences, it can be challenging to keep styles synchronized across multiple platforms and devices. At the same time, designers, developers, PMs and others must be able to have consistent and up-to-date style documentation to enable effective work and communication. Even then, mistakes inevitably happen and the design may not be implemented accurately. [Style Dictionary](https://amzn.github.io/style-dictionary/), by Amazon, attempts to solve this by automatically generating style definitions across all platforms from a single source - removing roadblocks, errors, and inefficiencies across your workflow.

Style Dictionary is a system and tool that allows you to define styles once, in a way for any platform or language to consume. A single place to create and edit your styles, and a single command exports these rules to all the places you need them - iOS, Android, CSS, JS, HTML, sketch files, style documentation, etc. It is available as an npm module that can be used inside of a Node project or on the command line.

## References and Further Reading

The information in this ADR is heavily inspired by prior art:

- [Spectrum's Design System](https://spectrum.adobe.com/page/design-tokens/)
- [Palmetto's Design System](https://ux.palmetto.com/?path=/docs/foundation-design-tokens--page)
- [Wikimedia's Design System](https://wmde.github.io/wikit/?path=/story/design-tokens-animation--page)
- [Style Dictionary](https://amzn.github.io/style-dictionary/)
