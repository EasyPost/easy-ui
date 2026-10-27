import { screen } from "@testing-library/react";
import React from "react";
import { vi } from "vitest";
import { Button } from "../Button";
import { HorizontalStack } from "../HorizontalStack";
import { TextField } from "../TextField";
import { render, userClick } from "../utilities/test";
import { FormLayout } from "./FormLayout";

describe("<FormLayout />", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should render a form layout", async () => {
    const handleSubmit = vi.fn((e) => {
      e.preventDefault();
    });

    const { user } = render(
      <FormLayout as="form" onSubmit={handleSubmit} aria-labelledby="form-id">
        <FormLayout.Header>
          <FormLayout.Title as="h2" id="form-id">
            Form Title
          </FormLayout.Title>
          <FormLayout.HelperText>Info Text 0</FormLayout.HelperText>
        </FormLayout.Header>
        <FormLayout.Section>
          <FormLayout.Header>
            <FormLayout.Title>Section Title 1</FormLayout.Title>
            <FormLayout.HelperText>Info Text 1</FormLayout.HelperText>
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
          <FormLayout.Header>
            <FormLayout.Title>Section Title 2</FormLayout.Title>
            <FormLayout.HelperText>Info Text 2</FormLayout.HelperText>
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
        <FormLayout.Grid columns={2}>
          <FormLayout.Section>
            <FormLayout.Header>
              <FormLayout.Title>Section Title 3</FormLayout.Title>
              <FormLayout.HelperText>Info Text 3</FormLayout.HelperText>
            </FormLayout.Header>
            <TextField
              label="Input 6"
              placeholder="Placeholder text"
              helperText="Optional helper text"
            />
          </FormLayout.Section>
          <FormLayout.Section>
            <FormLayout.Header>
              <FormLayout.Title>Section Title 4</FormLayout.Title>
              <FormLayout.HelperText>Info Text 4</FormLayout.HelperText>
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
      </FormLayout>,
    );

    // most things are presentational, so we want to just validate that elements
    // are rendered on the screen correctly
    expect(screen.getByRole("form")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Form Title" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("group", { name: "Section Title 1" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("textbox").length).toBe(12);

    await userClick(user, screen.getByRole("button", { name: "Submit" }));
    expect(handleSubmit).toHaveBeenCalled();
  });

  it("should render a section title with the default variant", () => {
    render(
      <FormLayout.Section>
        <FormLayout.Title>Section Title</FormLayout.Title>
      </FormLayout.Section>,
    );
    expect(
      screen.getByText("Section Title", { selector: "span" }),
    ).toHaveAttribute("class", expect.stringContaining("heading5"));
  });

  it("should render a title with a custom variant", () => {
    render(
      <FormLayout.Section>
        <FormLayout.Title variant="subtitle1">Section Title</FormLayout.Title>
      </FormLayout.Section>,
    );
    const title = screen.getByText("Section Title", { selector: "span" });
    expect(title).toHaveAttribute(
      "class",
      expect.stringContaining("subtitle1"),
    );
    expect(title).not.toHaveAttribute(
      "class",
      expect.stringContaining("heading5"),
    );
  });
});
