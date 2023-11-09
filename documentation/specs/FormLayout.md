# `FormLayout` Component Specification

## Overview

`FormLayout` arranges a layout of form elements with preset spacing.

### Prior Art

- [Paste `<Form />`](https://paste.twilio.design/components/form)

---

## Design

`FormLayout` will be a compound component consisting of `FormLayout`, `FormLayout.Header`, `FormLayout.Title`, `FormLayout.HelperText`, `FormLayout.Section`, and `FormLayout.Grid`.

`FormLayout` is a polymorphic component. Using the `as` prop, `FormLayout` can render as a `form` HTML element. By default, it will render as a `div` to not presuppose consumer structure.

`FormLayout.Section` can be used to layout forms in sections. Sections are rendered as `fieldset`s and their titles rendered as `legend`s.

`FormLayout.Header`, `FormLayout.Title`, and `FormLayout.HelperText` exist to provide headers, titles, and helper text to forms. These can be used within the main form layout as well as in sections.

`FormLayout.Grid` can be used to layout the form in columns. This component is a simple wrapper around `HorizontalGrid` with preconfigured gap settings.

### API

```ts
export type FormLayoutProps<T extends ElementType = "div"> =
  ComponentProps<T> & {
    as?: T;
    children: ReactNode;
  };

type FormLayoutHeaderProps = {
  children: ReactNode;
};

type FormLayoutTitleProps = {
  id?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  children: ReactNode;
};

type FormLayoutHelperTextProps = {
  children: ReactNode;
};

type FormLayoutSectionProps = {
  children: ReactNode;
};

type FormLayoutGridProps = {
  children: ReactNode;
  columns: HorizontalGridProps["columns"];
};
```

### Example Usage

_Basic form with title:_

```tsx
import { FormLayout } from "@easypost/easy-ui/FormLayout";

function ConsumerForm() {
  return (
    <FormLayout>
      <FormLayout.Header>
        <FormLayout.Title>Form Title</FormLayout.Title>
      </FormLayout.Header>
      <TextField
        label="Input 1"
        placeholder="Placeholder text"
        helperText="Optional helper text"
      />
      <TextField
        label="Input 2"
        placeholder="Placeholder text"
        helperText="Optional helper text"
      />
      <TextField
        label="Input 3"
        placeholder="Placeholder text"
        helperText="Optional helper text"
      />
    </FormLayout>
  );
}
```

_Basic form with helper text:_

```tsx
import { FormLayout } from "@easypost/easy-ui/FormLayout";

function ConsumerForm() {
  return (
    <FormLayout>
      <FormLayout.Header>
        <FormLayout.Title>Form Title</FormLayout.Title>
        <FormLayout.HelperText>Optional helper text</FormLayout.HelperText>
      </FormLayout.Header>
      <TextField
        label="Input 1"
        placeholder="Placeholder text"
        helperText="Optional helper text"
      />
      <TextField
        label="Input 2"
        placeholder="Placeholder text"
        helperText="Optional helper text"
      />
      <TextField
        label="Input 3"
        placeholder="Placeholder text"
        helperText="Optional helper text"
      />
    </FormLayout>
  );
}
```

_Form with section:_

```tsx
import { FormLayout } from "@easypost/easy-ui/FormLayout";

function ConsumerForm() {
  return (
    <FormLayout>
      <FormLayout.Header>
        <FormLayout.Title>Form Title</FormLayout.Title>
      </FormLayout.Header>
      <FormLayout.Section>
        <FormLayout.Header>
          <FormLayout.Title>Section Title</FormLayout.Title>
          <FormLayout.HelperText>
            Optional section helper text
          </FormLayout.HelperText>
        </FormLayout.Header>
        <TextField
          label="Input 1"
          placeholder="Placeholder text"
          helperText="Optional helper text"
        />
        <TextField
          label="Input 2"
          placeholder="Placeholder text"
          helperText="Optional helper text"
        />
        <TextField
          label="Input 3"
          placeholder="Placeholder text"
          helperText="Optional helper text"
        />
      </FormLayout.Section>
    </FormLayout>
  );
}
```

_Form with columns:_

```tsx
import { FormLayout } from "@easypost/easy-ui/FormLayout";

function ConsumerForm() {
  return (
    <FormLayout>
      <FormLayout.Header>
        <FormLayout.Title>Form Title</FormLayout.Title>
      </FormLayout.Header>
      <FormLayout.Grid columns={2}>
        <TextField
          label="Input 1"
          placeholder="Placeholder text"
          helperText="Optional helper text"
        />
        <TextField
          label="Input 2"
          placeholder="Placeholder text"
          helperText="Optional helper text"
        />
      </FormLayout.Grid>
    </FormLayout>
  );
}
```

_Complex example:_

```tsx
import { FormLayout } from "@easypost/easy-ui/FormLayout";

function ConsumerForm() {
  return (
    <FormLayout
      as="form"
      onSubmit={(e) => {
        e.preventDefault();
        // Submit handler
      }}
      aria-labelledby="form-id"
    >
      <FormLayout.Header>
        <FormLayout.Title id="form-id">Form Title</FormLayout.Title>
        <FormLayout.HelperText>Info Text</FormLayout.HelperText>
      </FormLayout.Header>
      <FormLayout.Section>
        <FormLayout.Header>
          <FormLayout.Title>Section Title</FormLayout.Title>
          <FormLayout.HelperText>Info Text</FormLayout.HelperText>
        </FormLayout.Header>
        <FormLayout.Grid columns={2}>
          <TextField
            label="Input 1"
            placeholder="Placeholder text"
            helperText="Optional helper text"
          />
          <TextField
            label="Input 2"
            placeholder="Placeholder text"
            helperText="Optional helper text"
          />
        </FormLayout.Grid>
        <FormLayout.Grid columns={2}>
          <TextField
            label="Input 3"
            placeholder="Placeholder text"
            helperText="Optional helper text"
          />
          <FormLayout.Grid columns={2}>
            <TextField
              label="Input 4"
              placeholder="Placeholder text"
              helperText="Optional helper text"
            />
            <TextField
              label="Input 5"
              placeholder="Placeholder text"
              helperText="Optional helper text"
            />
          </FormLayout.Grid>
        </FormLayout.Grid>
      </FormLayout.Section>
      <FormLayout.Section>
        <HorizontalStack gap="2" align="space-between" blockAlign="center">
          <FormLayout.Header>
            <FormLayout.Title>Section Title</FormLayout.Title>
            <FormLayout.HelperText>Info Text</FormLayout.HelperText>
          </FormLayout.Header>
          <span>
            <Button size="sm" variant="outlined" color="support">
              Action
            </Button>
          </span>
        </HorizontalStack>
        <FormLayout.Grid columns={2}>
          <TextField
            label="Input 1"
            placeholder="Placeholder text"
            helperText="Optional helper text"
          />
          <TextField
            label="Input 2"
            placeholder="Placeholder text"
            helperText="Optional helper text"
          />
        </FormLayout.Grid>
        <FormLayout.Grid columns={2}>
          <TextField
            label="Input 3"
            placeholder="Placeholder text"
            helperText="Optional helper text"
          />
          <FormLayout.Grid columns={2}>
            <TextField
              label="Input 4"
              placeholder="Placeholder text"
              helperText="Optional helper text"
            />
            <TextField
              label="Input 5"
              placeholder="Placeholder text"
              helperText="Optional helper text"
            />
          </FormLayout.Grid>
        </FormLayout.Grid>
      </FormLayout.Section>
      <FormLayout.Grid columns={2}>
        <FormLayout.Section>
          <FormLayout.Header>
            <FormLayout.Title>Section Title</FormLayout.Title>
            <FormLayout.HelperText>Info Text</FormLayout.HelperText>
          </FormLayout.Header>
          <TextField
            label="Input 6"
            placeholder="Placeholder text"
            helperText="Optional helper text"
          />
        </FormLayout.Section>
        <FormLayout.Section>
          <FormLayout.Header>
            <FormLayout.Title>Section Title</FormLayout.Title>
            <FormLayout.HelperText>Info Text</FormLayout.HelperText>
          </FormLayout.Header>
          <TextField
            label="Input 7"
            placeholder="Placeholder text"
            helperText="Optional helper text"
          />
        </FormLayout.Section>
      </FormLayout.Grid>
      <HorizontalStack>
        <Button type="submit">Submit</Button>
      </HorizontalStack>
    </FormLayout>
  );
}
```

---

## Behavior

### Accessibility

- `FormLayout.Section` is rendered as a `fieldset`. `FormLayout.Title` is rendered as a `legend` within a `FormLayout.Section`.
- `<form />`s should label themselves using `aria-labelledby` and passing the respective `id` to the `FormLayout.Title`.
- Prefer using only a single form per viewing context.
- Provide accessible and clear titles and helper text.
- When grouping related form elements, use `FormLayout.Section`, which renders an HTML fieldset. Use a `FormLayout.Title` to provide a legend to the fieldset.
- Consider breaking long forms into smaller sections or pages, as they can place more cognitive load on the user.
- Prefer a single column layout when possible, as it can be more difficult for users with limited vision to scan from right to left if a multi-column layout is used.
