---
status: Accepted
date: 2023-02-03
deciders: stephenjwatkins, OskiTheCoder, kevinalexliu
---

# Use standard conventions for component APIs

## Context and Problem Statement

Easy UI should have a set of basic standards and conventions for designing component APIs to deliver consistent DX and UX.

## Decision Drivers

- Scalability: As the project increases in complexity, conventions should streamline the development process and provide reliability.
- Intuitiveness: Easy UI component APIs should be approachable and easy to use.
- Adaptability: The level of effort to adapt components to conform to API guidelines should be relatively low.

## Considered Options

- MUI
- Shopify Polaris
- Chakra UI
- Ant Design
- Twilio Paste
- Adobe Spectrum
- GitHub Primer

1. Picking an existing above library to use as a single point of reference when designing component APIs.
2. Designing component APIs based on common patterns that exist across popular libraries.

## Decision Outcome

We decided on developing standards and conventions by looking at common API design patterns that exist across popular component libraries.

## More Information

Many of the component libraries above have some common API design patterns. The advantage of developing conventions based on common patterns is that our component library will be much more intuitive to use since we’d be relying on standards developed by larger teams with stronger support and more resources. In addition, we presently do not have any guidelines for conventions and this decision allows us to initiate efforts immediately with little friction. Conversely, adapting to a single library would require investigation into how the developers of the library approached composition as that influences the overall architecture of the component; and it's not immediately obvious how we could tackle that problem.

Component API best practices have been added to the [contribution guidelines](https://github.com/EasyPost/easy-ui/.github/CONTRIBUTING.md).
