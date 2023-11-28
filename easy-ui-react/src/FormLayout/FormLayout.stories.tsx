import { Meta, StoryObj } from "@storybook/react";
import React, { FormEvent } from "react";
import { TextField } from "../TextField";
import { FormLayout } from "./FormLayout";
import { HorizontalStack } from "../HorizontalStack";
import { Button } from "../Button";

type Story = StoryObj<typeof FormLayout>;

const meta: Meta<typeof FormLayout> = {
  title: "Components/FormLayout",
  component: FormLayout,
};

export default meta;

export const Default: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: 720,
        border: "1px solid #ddd",
      }}
    >
      <FormLayout
        as="form"
        onSubmit={(e: FormEvent) => {
          e.preventDefault();
          window.alert("here");
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
    </div>
  ),
};
