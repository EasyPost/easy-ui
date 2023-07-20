import { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { getSnippetEntries } from "../CodeSnippet/CodeSnippet.stories";
import { CodeBlock, CodeBlockProps } from "./CodeBlock";

type Story = StoryObj<typeof CodeBlock>;
type TemplateProps = Omit<CodeBlockProps, "language" | "onLanguageChange">;

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

export const HeaderColor: StoryObj<typeof CodeBlock.Header> = {
  render: (args) => (
    <Template>
      <CodeBlock.Header {...args}>Header</CodeBlock.Header>
      {getSnippets()}
    </Template>
  ),
  args: {
    color: "primary",
  },
  argTypes: {
    color: {
      options: ["neutral", "secondary", "primary"],
      control: { type: "radio" },
    },
  },
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
