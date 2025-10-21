import { Meta, StoryObj } from "@storybook/react-vite";
import { action } from "storybook/actions";
import React, { ComponentProps, FormEvent } from "react";
import { Button } from "../Button";
import { HorizontalStack } from "../HorizontalStack";
import { TextField } from "../TextField";
import { FormLayout } from "./FormLayout";
import { Textarea } from "../Textarea";
import { TabPanels } from "../TabPanels";

type Story = StoryObj<typeof FormLayout>;

const formSubmissionAction = action("Form submitted!");
const sectionAction = action("Action in section clicked!");

const meta: Meta<typeof FormLayout> = {
  title: "Components/FormLayout",
  component: FormLayout,
  decorators: [
    (Story) => (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          maxWidth: 720,
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export default meta;

export const Basic: Story = {
  render: () => (
    <FormLayout>
      <FormLayout.Header>
        <FormLayout.Title>Form Title</FormLayout.Title>
        <FormLayout.HelperText>Form info text</FormLayout.HelperText>
      </FormLayout.Header>
      <TextField
        label="Input 1"
        placeholder="Placeholder text"
        helperText="Helper text"
      />
      <TextField
        label="Input 2"
        placeholder="Placeholder text"
        helperText="Helper text"
      />
      <TextField
        label="Input 3"
        placeholder="Placeholder text"
        helperText="Helper text"
      />
      <TextField
        label="Input 4"
        placeholder="Placeholder text"
        helperText="Helper text"
      />
    </FormLayout>
  ),
};

export const Sections: Story = {
  render: () => (
    <FormLayout>
      <FormLayout.Header>
        <FormLayout.Title>Form Title</FormLayout.Title>
        <FormLayout.HelperText>Form info text</FormLayout.HelperText>
      </FormLayout.Header>
      <FormLayout.Section>
        <FormLayout.Header>
          <FormLayout.Title as="h3">Section Title 1</FormLayout.Title>
          <FormLayout.HelperText>Section info text</FormLayout.HelperText>
        </FormLayout.Header>
        <TextField
          label="Input 1"
          placeholder="Placeholder text"
          helperText="Helper text"
        />
        <TextField
          label="Input 2"
          placeholder="Placeholder text"
          helperText="Helper text"
        />
      </FormLayout.Section>
      <FormLayout.Section>
        <FormLayout.Header>
          <FormLayout.Title as="h3">Section Title 2</FormLayout.Title>
          <FormLayout.HelperText>Section info text</FormLayout.HelperText>
        </FormLayout.Header>
        <TextField
          label="Input 3"
          placeholder="Placeholder text"
          helperText="Helper text"
        />
        <TextField
          label="Input 4"
          placeholder="Placeholder text"
          helperText="Helper text"
        />
      </FormLayout.Section>
    </FormLayout>
  ),
};

export const Columns: Story = {
  render: () => (
    <FormLayout>
      <FormLayout.Header>
        <FormLayout.Title>Form Title</FormLayout.Title>
        <FormLayout.HelperText>Form info text</FormLayout.HelperText>
      </FormLayout.Header>
      <FormLayout.Grid columns={{ xs: 1, md: 2 }}>
        <TextField
          label="Input 1"
          placeholder="Placeholder text"
          helperText="Helper text"
        />
        <TextField
          label="Input 2"
          placeholder="Placeholder text"
          helperText="Helper text"
        />
        <TextField
          label="Input 3"
          placeholder="Placeholder text"
          helperText="Helper text"
        />
        <TextField
          label="Input 4"
          placeholder="Placeholder text"
          helperText="Helper text"
        />
      </FormLayout.Grid>
    </FormLayout>
  ),
};

export const Nesting: Story = {
  render: () => (
    <FormLayout>
      <FormLayout.Header>
        <FormLayout.Title>Form Title</FormLayout.Title>
        <FormLayout.HelperText>Form info text</FormLayout.HelperText>
      </FormLayout.Header>
      <FormLayout.Section>
        <FormLayout.Header>
          <FormLayout.Title>Section Title 1</FormLayout.Title>
          <FormLayout.HelperText>Section info text</FormLayout.HelperText>
        </FormLayout.Header>
        <TextField
          label="Input 1"
          placeholder="Placeholder text"
          helperText="Helper text"
        />
        <FormLayout.Grid columns={{ xs: 1, md: 2 }}>
          <FormLayout.Section>
            <FormLayout.Header>
              <FormLayout.Title>Section Title 2</FormLayout.Title>
              <FormLayout.HelperText>Section info text</FormLayout.HelperText>
            </FormLayout.Header>
            <TextField
              label="Input 2"
              placeholder="Placeholder text"
              helperText="Helper text"
            />
            <FormLayout.Grid columns={2}>
              <TextField
                label="Input 3"
                placeholder="Placeholder text"
                helperText="Helper text"
              />
              <TextField
                label="Input 4"
                placeholder="Placeholder text"
                helperText="Helper text"
              />
            </FormLayout.Grid>
          </FormLayout.Section>
          <FormLayout.Section>
            <FormLayout.Header>
              <FormLayout.Title>Section Title 3</FormLayout.Title>
              <FormLayout.HelperText>Section info text</FormLayout.HelperText>
            </FormLayout.Header>
            <TextField
              label="Input 5"
              placeholder="Placeholder text"
              helperText="Helper text"
            />
            <FormLayout.Grid columns={{ xs: 1, md: 2 }}>
              <TextField
                label="Input 6"
                placeholder="Placeholder text"
                helperText="Helper text"
              />
              <TextField
                label="Input 7"
                placeholder="Placeholder text"
                helperText="Helper text"
              />
            </FormLayout.Grid>
          </FormLayout.Section>
        </FormLayout.Grid>
      </FormLayout.Section>
    </FormLayout>
  ),
};

export const AsAForm: Story = {
  render: () => (
    <FormLayout
      as="form"
      onSubmit={(e: FormEvent) => {
        e.preventDefault();
        formSubmissionAction();
      }}
      aria-labelledby="form-title-id"
    >
      <FormLayout.Header>
        <FormLayout.Title id="form-title-id">Form Title</FormLayout.Title>
        <FormLayout.HelperText>Form info Text</FormLayout.HelperText>
      </FormLayout.Header>
      <TextField
        label="Input 1"
        placeholder="Placeholder text"
        helperText="Helper text"
      />
      <TextField
        label="Input 2"
        placeholder="Placeholder text"
        helperText="Helper text"
      />
      <TextField
        label="Input 3"
        placeholder="Placeholder text"
        helperText="Helper text"
      />
      <TextField
        label="Input 4"
        placeholder="Placeholder text"
        helperText="Helper text"
      />
      <HorizontalStack>
        <Button type="submit">Submit</Button>
      </HorizontalStack>
    </FormLayout>
  ),
};

export const SectionAction: Story = {
  render: () => (
    <FormLayout>
      <FormLayout.Header>
        <FormLayout.Title>Form Title</FormLayout.Title>
        <FormLayout.HelperText>Form info text</FormLayout.HelperText>
      </FormLayout.Header>
      <FormLayout.Section>
        <HorizontalStack gap="2" align="space-between" blockAlign="center">
          <FormLayout.Header>
            <FormLayout.Title>Section Title 2</FormLayout.Title>
            <FormLayout.HelperText>Section info text</FormLayout.HelperText>
          </FormLayout.Header>
          <Button
            size="sm"
            variant="outlined"
            color="support"
            onPress={sectionAction}
          >
            Action
          </Button>
        </HorizontalStack>
        <TextField
          label="Input 1"
          placeholder="Placeholder text"
          helperText="Helper text"
        />
        <TextField
          label="Input 2"
          placeholder="Placeholder text"
          helperText="Helper text"
        />
        <TextField
          label="Input 3"
          placeholder="Placeholder text"
          helperText="Helper text"
        />
        <TextField
          label="Input 4"
          placeholder="Placeholder text"
          helperText="Helper text"
        />
      </FormLayout.Section>
    </FormLayout>
  ),
};

export const WithTabs: Story = {
  render: () => (
    <FormLayout>
      <FormLayout.Header>
        <FormLayout.Title>Claim Submission</FormLayout.Title>
        <FormLayout.HelperText>
          Some text about why we are doing this would be nice here
        </FormLayout.HelperText>
      </FormLayout.Header>
      <FormLayout.Section>
        <TabPanels>
          <FormLayout.Header>
            <FormLayout.Title as="h3">Claim Type</FormLayout.Title>
          </FormLayout.Header>
          <TabPanels.Tabs>
            <TabPanels.Item key="tracking-number">
              By Tracking Number
            </TabPanels.Item>
            <TabPanels.Item key="insurance-id">By Insurance ID</TabPanels.Item>
          </TabPanels.Tabs>
          <TabPanels.Panels>
            <TabPanels.Item key="tracking-number">
              <TextField
                label="EasyPost Tracking Number"
                placeholder="Enter Tracking Number"
              />
            </TabPanels.Item>
            <TabPanels.Item key="insurance-id">
              <TextField
                label="EasyPost Insurance ID"
                placeholder="Enter Insurance ID"
              />
            </TabPanels.Item>
          </TabPanels.Panels>
        </TabPanels>
      </FormLayout.Section>
      <Divider />
      <FormLayout.Section>
        <FormLayout.Header>
          <FormLayout.Title as="h3">Claim Info</FormLayout.Title>
        </FormLayout.Header>
        <TextField label="Name*" placeholder="Full Name" />
        <Textarea
          label="Description of Item(s)*"
          placeholder="Add additional details"
          rows={4}
        />
        <TextField label="Package Recipient" placeholder="Full Name" />
      </FormLayout.Section>
    </FormLayout>
  ),
};

function Divider(props: ComponentProps<"div">) {
  return (
    <div style={{ height: 0, borderBottom: "1px solid #C6CFE0" }} {...props} />
  );
}
