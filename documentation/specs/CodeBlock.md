# `CodeBlock` Component Specification

## Overview

A `CodeBlock` is used to display and switch between readable blocks of code.

### Use Cases

- Use a `CodeBlock` to improve readability of embedded code samples with syntax highlighting and automatic line numbering.
- Use a `CodeBlock` to allow the user to select between multiple `CodeSnippet`s.
- Use a `CodeBlock` to allow copying code to the user's clipboard.

### Features

- Supports selecting among several `CodeSnippet`s
- Supports copying code to the clipboard
- Supports a header with title describing the code block

### Prior Art

- [Paste `<CodeBlock />`](https://paste.twilio.design/components/code-block)
- [Atlassian `<CodeBlock />`](https://atlassian.design/components/code/code-block)
- [Sentry `<CodeSnippet />`](https://storybook.sentry.dev/?path=/story/components-code-snippet--js)

---

## Design

`CodeBlock` wraps one or more `CodeSnippet`s with a header to allow the user to switch between them.

`CodeBlock` will be a controlled component. It will require the consumer to provide a selected language and manage its state.

`CodeBlock` will flatten and read its children to pull out the snippets and header. This means that the snippets and header need to be direct children. This shouldn't pose problems. If a set of snippets need to be reused, it can be made a function. If it does end up being a problem, we can consider rearchitecting it to use context. Using context is a more complex implementation so we'll cross that bridge when we need to.

### API

```ts
type CodeBlockProps = {
  /**
   * CodeBlock content. This should be a header and collection of snippets.
   */
  children: ReactNode;

  /**
   * Selected language.
   */
  language: SnippetLanguages;

  /**
   * Callback for when the selected language changes.
   */
  onLanguageChange: (language: SnippetLanguages) => void;
};

type CodeBlockHeaderProps = {
  /**
   * Header title.
   */
  children: ReactNode;

  /**
   * Header color.
   *
   * @default neutral
   */
  color?: "neutral" | "primary" | "secondary";
};

type CodeBlockSnippetProps = CodeSnippetProps;
```

### Example Usage

```tsx
import { CodeBlock } from "@easypost/easy-ui/CodeBlock";

function Component() {
  const [language, setLanguage] = useState("javascript");
  return (
    <CodeBlock language={language} onLanguageChange={setLanguage}>
      <CodeBlock.Header>Header</CodeBlock.Header>
      <CodeBlock.Snippet language="javascript" code={``} />
      <CodeBlock.Snippet language="csharp" code={``} />
    </CodeBlock>
  );
}
```

_Custom header color:_

```tsx
import { CodeBlock } from "@easypost/easy-ui/CodeBlock";

function Component() {
  const [language, setLanguage] = useState("javascript");
  return (
    <CodeBlock language={language} onLanguageChange={setLanguage}>
      <CodeBlock.Header color="secondary">Header</CodeVisualizer.Header>
      <CodeBlock.Snippet language="javascript" code={``} />
      <CodeBlock.Snippet language="csharp" code={``} />
    </CodeBlock>
  );
}
```

_Dynamic snippets:_

```tsx
import { CodeBlock } from "@easypost/easy-ui/CodeBlock";

function Component() {
  const [language, setLanguage] = useState("javascript");
  return (
    <CodeBlock language={language} onLanguageChange={setLanguage}>
      <CodeBlock.Header>Header</CodeBlock.Header>
      {Object.entries(getSnippets()).map(([language, code]) => (
        <CodeBlock.Snippet
          key={language}
          language={language}
          code={code}
          maxLines={12}
          showLineNumbers
        />
      ))}
    </CodeVisualizer>
  );
}

function getSnippets() {
  return {
    [SnippetLanguage.CSHARP]: `code here...`,
    [SnippetLanguage.JAVA]: `code here...`,
    [SnippetLanguage.JSON]: `code here...`,
    [SnippetLanguage.PHP]: `code here...`,
  };
}
```

---

## Behavior

### Accessibility

- User should provide a descriptive label such as the current filename or step in a process to clarify the purpose of the Code Block
- Copy button should have relevant visually hidden text

### Dependencies

- Easy UI `Card`, `Tooltip` components
