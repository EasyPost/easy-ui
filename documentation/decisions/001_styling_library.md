---
status: Accepted
date: 2023-02-03
deciders: stephenjwatkins, OskiTheCoder, kevinalexliu
---

# Use CSS Modules as styling library

## Context and Problem Statement

Easy UI needs a capable styling library to handle the design needs of its component library while offering appropriate protections at scale.

## Decision Drivers

- Familiarity—general learning curve; ease of adoption at EasyPost; tooling cohesion across teams
- Capabilities—bundler integration; component encapsulation; CSS feature set; static generation; theming; types; responsive props; container queries
- Health—standing in community; active contributor base; maturity; any known major issues or security concerns
- API syntax and rigor

## Considered Options

1. CSS Modules
2. Vanilla Extract
3. Styled JSX
4. Atomic Frameworks
5. "Styled Components"

## Decision Outcome

We decided to use CSS Modules because it offers familiarity to the team while addressing our design needs at scale.

## More Information

After researching options above, the best options came to CSS Modules and Vanilla Extract.

Vanilla Extract has a lot to offer. Mark Dalgleish, who co-created CSS Modules, created Vanilla Extract as a spiritual successor of CSS Modules. It most-notably has first-class type support. However, due to its learning curve and relatively nascent status, it's not recommended as the first choice at EasyPost.

Given that the UI Engineering team has worked with CSS directly for so long, CSS Modules is a natural, effective extension to that existing paradigm. It allows the team to use a familiar format while providing safeguards around encapsulation for scalability. CSS Modules also provides maturity, extensive capabilities through plugging into the PostCSS pipeline, and community support.
