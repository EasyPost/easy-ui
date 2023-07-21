import { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { getSnippetEntries as getAllSnippetEntries } from "../CodeSnippet/CodeSnippet.stories";
import { CodeBlock, CodeBlockProps } from "./CodeBlock";
import { HorizontalGrid } from "../HorizontalGrid";

type Story = StoryObj<typeof CodeBlock>;
type TemplateProps = Omit<CodeBlockProps, "language" | "onLanguageChange">;

const getSnippetEntries = () =>
  getAllSnippetEntries().filter(([language]) => language !== "json");

const Template = (props: TemplateProps) => {
  const [language, setLanguage] = useState(() => getSnippetEntries()[0][0]);
  return (
    <CodeBlock {...props} language={language} onLanguageChange={setLanguage} />
  );
};

const getSnippets = () => (
  <>
    {getSnippetEntries().map(([language, code]) => (
      <CodeBlock.Snippet
        key={language}
        language={language}
        code={code}
        maxLines={12}
        showLineNumbers
      />
    ))}
  </>
);

const meta: Meta<typeof CodeBlock> = {
  title: "Components/CodeBlock",
  component: CodeBlock,
  args: {
    children: (
      <>
        <CodeBlock.Header color="neutral">Header</CodeBlock.Header>
        {getSnippets()}
      </>
    ),
  },
  parameters: {
    controls: {
      exclude: ["children", "language", "onLanguageChange"],
    },
  },
};

export default meta;

export const Default: Story = {
  render: Template.bind({}),
};

export const ViewOnly: Story = {
  render: () => {
    const [language, code] = getSnippetEntries()[0];
    return (
      <Template>
        <CodeBlock.Header>Header</CodeBlock.Header>
        <CodeBlock.Snippet
          language={language}
          code={code}
          maxLines={12}
          showLineNumbers
        />
      </Template>
    );
  },
};

export const CustomHeader: StoryObj<typeof CodeBlock.Header> = {
  render: (args) => (
    <Template>
      <CodeBlock.Header {...args} />
      {getSnippets()}
    </Template>
  ),
  args: {
    children: "Header",
    color: "primary",
  },
  argTypes: {
    children: { control: "text" },
    color: {
      options: ["neutral", "secondary", "primary"],
      control: { type: "radio" },
    },
  },
  parameters: {
    controls: {
      exclude: ["language", "onLanguageChange"],
    },
  },
};

export const SideBySide: Story = {
  render: () => {
    const jsonSnippet = getAllSnippetEntries().find(([l]) => l === "json");
    if (!jsonSnippet) {
      throw new Error("Snippets should have JSON entry");
    }
    const [jsonLang, jsonCode] = jsonSnippet;
    return (
      <HorizontalGrid columns={{ xs: 1, md: 2 }} gap="2" alignItems="start">
        <Template>
          <CodeBlock.Header color="primary">Request</CodeBlock.Header>
          {getSnippets()}
        </Template>
        <Template>
          <CodeBlock.Header>Response</CodeBlock.Header>
          <CodeBlock.Snippet
            language={jsonLang}
            code={jsonCode}
            maxLines={12}
            showLineNumbers
          />
        </Template>
      </HorizontalGrid>
    );
  },
};
