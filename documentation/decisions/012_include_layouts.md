---
status: Approved
date: 2023-08-17
deciders: stephenjwatkins, OskiTheCoder, ldewald
---

# Include layouts in Easy UI

## Context and Problem Statement

Easy UI needs to determine if it will include site-specific layouts in its component library.

While shared components are more obviously included in component libraries, broader-scoped components such as layouts are often deferred to their respective app. There are reasons to include them in a component library however. This decision will record will analyze the situation and make a determination that suits its requirements.

## Decision Drivers

- Non-disruptive to site developers
- Layouts should play well with frameworks and site-level architectures
- Site-specific logic can be deferred to the consumer
- Quality standards can be met

## Options Considered

- Include layouts in Easy UI
- Create a "Patterns" guide for creating layouts using Easy UI components
- Create a generic PageLayout component that can scaffold an array of generic configurations
- Defer layout responsibility entirely to their respective site

## Decision Outcome

Easy UI will include layouts in its component library as Shell components. Shell components will only concern itself with presentation, deferring business logic to the consumer.

## Analysis

Researched how component libraries do this. Per usual, every component library does it differently. Some component libraries include concrete page layouts with targeted hooks for content. Other times component libraries provide a generic page layout component that allows for broad-use slotting in of content. And others simply provide a "Patterns" section in their library documentation that guides consumers how to construct layouts using components in the libraries. Finally, it could be an aspect that the component library doesn't deal with at all.

There are advantages and disadvantages to each approach.

By not dealing with it at all, it eases the burden of the component library. The library can focus exclusively on shared concerns and lower-level matters. This puts the responsibility on the consumer, however, to "fend for itself". This allows the consumer to work fast and flexibly at the cost of potential inconsistency and lower standards.

By deferring complete responsibility to the consumer with patterns, you allow the consuming site to have complete control over its layout, presentation included. This obviously allows the most freedom and flexibility and general nimbleness to the specific site. This results in a faster short term result. The cost of this approach is that it can lead to general inconsistencies across the Web ecosystem, as well as lower the bar on quality standards.

Using a more generic page layout component can sometimes be beneficial by allowing a more freeform "page builder" kind of pattern. This pattern allows for a large set of pages to be composed by providing an outer container with varying inner components that can be stacked on top of each other. This can be common for marketing pages where content is varying and more freeform, but it can also be used for appy sites. See Atlaskit's PageLayout component as an example.

Finally, some component libraries provide specific page components that should be directly used by consumers. They provide properties on these components to allow for a specific level of customization to the consumer, but by and large the presentation and structure is locked down by the component itself. While this reduces the level of flexibility and control by the consumer, it has the advantage of allowing the consumer to do less work while leading to a more cohesive UI ecosystem with higher UX standards due to the UX tooling accompanying the component library.

It's worth noting that none of these approaches include business logic as part of the component. Only presentational concerns. Business logic should be left to the consuming site. They are each just varying degrees of how much presentation is locked down by the component in the component library.

Due to the makeup of the organization at EasyPost, we will include concrete page layouts with targeted hooks for conent in Easy UI. Consuming sites will have control over the business logic and any presentational hooks will be dictated by design. This decison will benefit our ecosystem by ensuring there is consistency and a higher quality standard with the Easy UI tooling and processes.

While we will include these components in Easy UI, we will not dilute the specific meaning of the names "page" and "layout" in web frameworks. Pages are often the leaf node in routing structures, while layouts are branches in the routing hierarchy. Pages and layouts often carry certain business logic pertaining to that part of the routing tree. As such, because Easy UI only concerns itself with presentational concerns, we should avoid naming components that could conflict with these existing semantics. So we'll use the suffix "Shell" to denote that it only contains the presentational shell of the respective layout.

## Example

Shells can be used inside existing layouts:

```tsx
import { ProductShell } from "@easypost/easy-ui/FocusedProductLayout";

function DashboardLayout() {
  // handles business logic for determining logged in user, redirects, etc
  return (
    <ProductShell>
      <ProductShell.Sidebar {/*props*/} />
      <ProductShell.Body>
        {children}
      <ProductShell.Body>
    <ProductShell>
  );
}
```
