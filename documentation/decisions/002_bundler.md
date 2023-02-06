---
status: Accepted
date: 2023-02-06
deciders: stephenjwatkins, OskiTheCoder, kevinalexliu
---

# Use Vite as bundler

## Context and Problem Statement

Easy UI needs a simple-yet-powerful way to bundle its component library for outside consumers.

## Decision Drivers

- Low friction—minimal API surface area; easy to adopt, use, and maintain across EasyPost; compatible with reliant systems
- Healthy—active project; thriving ecosystem; no major security concerns
- Capable—TypeScript/TSX; CSS Modules; static assets; code splitting; browser target support; watch mode; direct pairing with Storybook
- Performant

## Considered Options

1. Vite
2. Rollup
3. tsup
4. ESBuild
5. Parcel
6. SWC
7. Webpack

## Decision Outcome

We decided to use Vite because it supports needed functionality in a simple, performant manner with a thriving ecosystem around it.

## More Information

Most of front-end bundlers can ultimately handle bundling a component library. The differences primarily lie in overall friendliness and performance.

Webpack stands alone as a particularly complicated and heavy bundler. Although it’s capable, it’s considered legacy and largely geared towards apps; it would not be a good choice for our purposes.

ESBuild, SWC, and Rollup are lower-level bundlers that are capable through a system of extensions. They are performant and relatively light out of the box. However, while not terribly complex, they do require a moderate amount of customization. For web-related properties, Rollup is the friendliest of this group. ESBuild would be the next friendliest, followed by SWC.

Parcel, tsup, and Vite are "batteries-included" bundlers. Parcel largely implements its own technology, while tsup and Vite wrap underlying bundlers (ESBuild and Rollup). Parcel is capable but relatively heavy in relation to other modern contenders on our list. Vite is capable while being a little more lean and performant. Tsup is simple and light but the least capable in terms of web-related support.

Vite is strong because it has web-related functionality needed for a component library with simple and sane configuration, while staying relatively lean, being performant, having solid community support, and integrating with Storybook.

For a solution that allows the most flexibility, and not locked into any potential opinionated configuration, Rollup would be a good option.
