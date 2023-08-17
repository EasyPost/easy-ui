---
status: Approved
date: 2023-08-17
deciders: stephenjwatkins, OskiTheCoder, ldewald
---

# Incorporate page layouts in Easy UI

## Context and Problem Statement

Easy UI is evaluating the inclusion of site-specific page layouts in its component library. While shared, specialized components are commonly part of libraries, broader page layout components are often left to the app. This decision record will assess the situation and attempt to align with the organization's needs.

## Decision Drivers

- Compatibility with frameworks and site architectures
- Support for site-specific business logic and extensibility
- Adherence to quality standards
- Scalability with evolving design, Easy UI, and consuming sites
- Minimal disruption for site developers

## Options Considered

- Include page layout components in Easy UI
- Develop a "Patterns" guide for Easy UI-based page layout creation
- Opt-out of page layouts, deferring responsibility to sites

## Decision Outcome

Easy UI will incorporate layouts into its component library as "PageShell" components, focusing solely on presentation while delegating business logic to consumers.

## Analysis

Various component libraries adopt different strategies for managing page layouts, each with its own set of advantages and limitations. These strategies include:

**Opting Out**: Some component libraries choose not to include predefined page layouts. This approach allows the library to focus on specific, shared functionalities. While it reduces responsibilities for platform teams, it places greater onus on feature teams. As a consequence, without the support of component library tools, feature teams might need to reimplement certain elements, potentially leading to inconsistent and suboptimal user experiences (UX).

**Using Documented "Patterns"**: Some component libraries provide users with documented "Patterns" to guide them in creating layouts using the library's components. This approach simplifies implementation compared to starting from scratch and permits customization at the site level. However, it can still result in disparities and duplicated efforts over time. For this method to be successful, Easy UI must build and document all essential components necessary for building page layouts.

**Including Page Layouts**: Another approach involves supplying dedicated page layout components with predefined slots for content placement. This shifts the responsibility onto the component library and platform team, reducing the implementation burden on feature teams. This approach limits flexibility outside the library and mandates updates to adhere to the component library's processes. Nonetheless, this facilitates the use of component library tooling and processes, enhancing consistency and UX.

It's important to emphasize that, regardless of the approach chosen, the handling of business logic remains the responsibility of the consumer. Components should exclusively address presentation-related matters.

Given EasyPost's organizational structure, characterized by distinct feature teams and relatively subpar UX tooling/processes beyond the component library, we opt to develop and maintain page layout components within Easy UI. These page layout components will include essential properties and hooks, enabling consuming sites to meet their individual design and feature requisites. This decision benefits our entire platform by promoting uniformity and upholding higher quality standards, particularly for page layouts being some of the more UI-challenging aspects of our sites.

**Regarding Terminology:** Although we will incorporate these components into Easy UI, we intend to preserve the distinct meanings of "page" and "layout" found in web frameworks. "Pages" often represent terminal nodes in routing structures, whereas "layouts" signify branches. Both pages and layouts commonly involve specific business logic pertaining to their respective parts of the routing tree. Since Easy UI exclusively deals with presentation-related concerns, we will avoid naming components in a way that might confuse or overlap with these established semantics. Instead, we will adopt the term "Shell" (i.e. `ProductShell`), to explicitly indicate that it encompasses the outer presentation container of the corresponding layout.

## Example

_app/layouts/DashboardLayout:_

```tsx
import { ProductShell } from "@easypost/easy-ui/FocusedProductLayout";

// DashboardLayout component handles site-specific business logic (e.g.
// determining logged in user, redirects, etc)
function DashboardLayout() {
  return (
    <ProductShell>
      <ProductShell.Sidebar {/* props and hooks for customization */} />
      <ProductShell.Body {/* props and hooks for customization */} />
    <ProductShell>
  );
}
```

Note that this isn't a spec, just a high-level example of how to think about what the component library would offer and how it could be incorporated into existing apps.
