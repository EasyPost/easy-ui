---
status: Accepted
date: 2023-02-17
deciders: stephenjwatkins, OskiTheCoder, kevinalexliu
---

# Use Vitest for unit tests

## Context and Problem Statement

Easy UI needs a unit testing framework to ensure the functional correctness of components and related code within the library.

## Decision Drivers

- Adaptability: Team familiarity, friction with bundler choice, and compatibility with other systems.
- Ease of use: Sane configurations, easy to use, and easy to maintain long term.
- Project health/maturity: Active project, relatively solid ecosystem, and a widely adopted solution.
- Performance

## Considered Options

- Jest
- Vitest
- @SWC/Jest

## Decision Outcome

We have decided to move forward with Vitest as our unit testing framework.

## More Information

In isolation, any of the above options would suffice, however given that we have already collectively decided to use Vite as our bundler, we found that it would likely be beneficial for our team to select an option that provides the least friction in getting setup while also providing good DX and performance. The integration of Vitest with Vite appears seamless, and Vitest has sound configurations, good DX as it takes inspiration from Jest which minimizes the learning curve for our team, it is Typescript friendly, and the ecosystem has a good standing in the community. Our second choice would be SWC/Jest. One downside of SWC/Jest is the upfront configuration with Vite. Also we found the documentation to be lacking. Vitest does however come with a potential downside in that it may have some general ecosystem incompatibilities with our project as a whole. Nonetheless, if our team comes to a point where the incompatibilities disrupt DX or create unnecessary technical debt, it would appear as though the effort involved in migrating away from Vitest would be low.
