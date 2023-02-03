---
status: Accepted
date: 2023-02-02
deciders: stephenjwatkins, OskiTheCoder, kevinalexliu
---

# Use NPM as package manager

## Context and Problem Statement

Easy UI needs a robust package manager to power a monorepo with multiple supporting UI projects. This decision record highlights the available options and accompanying research.

## Decision Drivers

- Familiarity—general learning curve; ease of adoption at EasyPost; tooling cohesion across teams
- Capabilities—ecosystem compatibility; performance; reliability; robustness; emergent feature set
- Health—standing in community; level of activity; any known major issues or security concerns

## Considered Options

1. NPM
2. PNPM
3. Yarn

## Decision Outcome

We decided to use NPM because it offers the most familiarity to the team, is most compatible with the rest of the node ecosystem, and is supported by systems at EasyPost.

## More Information

While the initial version of Yarn was a big deal to the JS community, future versions of Yarn failed to take root in the same way. Yarn v1 is now considered legacy and can't be recommended in good faith on newer projects. While the latest version of Yarn is a strong package manager, it's not favored due to its decreased significance within the community while lacking obvious benefits from PNPM.

NPM and PNPM are both reasonable choices dependent on what the team wants to prioritize.

NPM is a good option if maturity, ecosystem compatibility, team familiarity, project consistency and EasyPost system parity is important.

PNPM has become the de-facto choice of monorepo tooling in OSS. It's a good option if we’re willing to sacrifice some familiarity, consistency, maturity, EasyPost system parity, and potential lack of ecosystem compatibility for a more emergent, more performant and generally-capable package manager.

See [spike](https://docs.google.com/document/d/1P7xwKrW3Y4R2kUa0Wtlx7sR1G3UCi2ywKrFl2Lz1-WE) (internal) for details on research.
