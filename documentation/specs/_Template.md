> This document represents a component specification template. Its purpose
> is to provide a point-in-time guide as to how a component should be
> authored, in light of common anatomies, behaviors, and accessibility.
> The primary audience is a developer authoring a given component. Feel free to
> pick and choose what sections are relevant for the component being designed.

# `{ComponentName}` Component Specification

## Overview

_A high-level description of the component._

### Use Cases

_Primary use cases for this component._

### Features

_A list of the key features unique to this component._

### Risks and Challenges

_Notable risks or challenges associated with the component._

### Prior Art

_Link to any existing, canonical, or exemplary implementations of the component._

---

## Design

### API

_Outline any key elements of the component's public API surface._

#### Properties

| Property Name | Type     | Default Value  | Description                      |
| ------------- | -------- | -------------- | -------------------------------- |
| `value`       | `number` | Value of `min` | The current value of the slider. |
| `min`         | `number` | `0`            | The minimum value of the slider. |

#### Example Usage

_Provide real-world examples of how the component API will be used._

### Anatomy

_Outline the component's structure._

#### DOM Structure

_Define the recommended DOM to represent the component's anatomy. Show how important attributes (aria attributes especially) are applied to the various parts. In cases where a component nests other components, expand the full DOM structure to understand the expectation and any shortcomings in the child components' customizability._

---

## Behavior

### States and Interactions

_List key component states, valid state transitions, and how interactions trigger state transitions._

### Accessibility

_Consider the accessibility of the component._

#### Keyboard Navigation and Focus

- _Arrow vs tabbing key behavior_
- _Modifier key effects (e.g. shift, ctrl, meta)_
- _Does this component use focus delegation?_

### Security

_Are there any security implications surrounding the component?_

### Performance

_Are there any performance pitfalls or challenges with implementing the component? (examples below)_

- If the component renders a loop of items, should certain areas be considered for virtualization?
- If the component needs to measure an area before rendering, how will jank be avoided?
- If any measuring is needed at all, can rAF techniques help queue measures and prevent synchronous reflows?

## Dependencies

_Will implementing the component require taking on any dependencies?_

- _3rd party libraries_
- _Upcoming standards we need to polyfill_
- _Do any dependencies bring along an associated timeline?_

### Platform Requirements

_Are there any core web platform features that are needed to implement this component well?_

---

## Resources

_Any related resource links such as web standards, discussion threads, diagrams, etc._
