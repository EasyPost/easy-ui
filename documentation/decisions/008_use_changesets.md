---
status: Approved
date: 2023-03-20
deciders: stephenjwatkins, OskiTheCoder, ldewald
---

# Use changesets

## Context and Problem Statement

Easy UI needs to faciliate simple versioning and publishing of its packages.

## Decision Drivers

- Simple to understand and work with the versioning and publishing process
- Automatic changelog generation
- Automatic version management across packages
- Familiarity with and support from the broader community
- Tooling has appropriate project health
- Process and tooling has ability to be automated

## Options Considered

- [Changesets](https://github.com/changesets/changesets)
- [semantic-release](https://github.com/semantic-release/semantic-release)
- [intuit/auto](https://github.com/intuit/auto)
- Manual process

## Decision Outcome

We will use [Changesets](https://github.com/changesets/changesets) as the tool and paradigm for versioning and publishing packages within Easy UI.

## More Information

Changesets is the most popular tool for managing versions in monorepos. In fact, it was developed specifically for monorepos, so it works well out of the box for managing inter-dependent projects. As an example, it can know how to increment a package's version based on the types of changes generated across dependencies, which is really useful in a monorepo. It also has modern tooling to support its workflows, such as a Github Action and PR bot. This standing in the community for monorepo projects and its supporting toolset make it the decision of choice for Easy UI.

Auto from Intuit and Semantic Release are other tools in the community. Auto doesn't have the same level of ubiquity and health in the community, and Semantic Release doesn't have the first-class monorepo support. For those reasons, neither are recommended over Changesets.

Apart from existing tools, Easy UI could build custom processes of its own like some component libraries do, but that's a lot of effort to mostly reinvent the wheel, so it's not a recommendation.

### Process

Easy UI will follow a specific workflow for versioning and publishing packages:

_Development:_

- Changesets added along with each change as part of the pull request

```shell
npm run changes:add
```

_Releasing:_

- Apply changesets to individual packages and generate changelog entries

```shell
npm run changes:version
```

- Review changes, modifying changelog entries where appropriate, and commit changes

```shell
git commit -m "Version packages"
```

- Publish changes and push tags

```shell
npm run changes:publish
git push --follow-tags
```

### Automation

The manual workflow is sufficient for the initial understanding and evolving of the release process, but it's too finnicky to be the solution long-term.

Fortunately, Changesets has a [Github Action](https://github.com/changesets/action) that can be setup for [automating](https://github.com/changesets/changesets/blob/main/docs/automating-changesets.md) the versioning and publishing process.

## Further Reading

- [Changesets documentation](https://github.com/changesets/changesets/tree/main/docs)
