import { screen } from "@testing-library/react";
import React from "react";
import { vi } from "vitest";
import { Button } from "../Button";
import { HorizontalStack } from "../HorizontalStack";
import { TextField } from "../TextField";
import {
  mockGetComputedStyle,
  mockIntersectionObserver,
  render,
} from "../utilities/test";
import { FormLayout } from "./FormLayout";

describe("<FormLayout />", () => {
  let restoreGetComputedStyle: () => void;
  let restoreIntersectionObserver: () => void;

  beforeEach(() => {
    vi.useFakeTimers();
    restoreIntersectionObserver = mockIntersectionObserver();
    restoreGetComputedStyle = mockGetComputedStyle();
  });

  afterEach(() => {
    restoreGetComputedStyle();
    restoreIntersectionObserver();
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

    expect(screen.getByRole("form")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Form Title" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("group", { name: "Section Title 1" }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Submit" }));
    expect(handleSubmit).toHaveBeenCalled();
  });
});
