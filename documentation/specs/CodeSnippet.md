# `CodeSnippet` Component Specification

## Overview

A `CodeSnippet` is used to display readable blocks of code.

### Use Cases

- Use a `CodeSnippet` to improve readability of embedded code samples with syntax highlighting and automatic line numbering.

### Features

- Supports optional line numbering
- Supports maximum number of lines before scroll
- Supports multiple languages

### Prior Art

- [Paste `<CodeBlock />`](https://paste.twilio.design/components/code-block)
- [Atlassian `<CodeBlock />`](https://atlassian.design/components/code/code-block)
- [Sentry `<CodeSnippet />`](https://storybook.sentry.dev/?path=/story/components-code-snippet--js)

---

## Design

`CodeSnippet` at a base level is pretty simple. It requires a `code` snippet and `language` for highlighting. It can optionally show line numbers and render a maximum number of lines before scrolling. It renders inside of a `Card`.

`CodeSnippet` will utilize the `PrismLight` export of `react-syntax-highlighter` to enable syntax highlighting. A lightweight wrapper component called `SyntaxHighlighter` will be created to wrap some details specific to EasyPost, including importing required languages and building some utilities around theme customization.

### API

```ts
export type SnippetLanguages =
  | "csharp"
  | "go"
  | "java"
  | "javascript"
  | "json"
  | "php"
  | "python"
  | "ruby"
  | "shell";

type CodeSnippetProps = Partial<Omit<HTMLDivElement, "children">> & {
  /**
   * `children` is not supported. Use `code` instead.
   */
  children?: never;

  /**
   * The code snippet to be rendered.
   */
  code: string;

  /**
   * The language of the code snippet.
   */
  language: SnippetLanguages;

  /**
   * Constrains the height of code block to a set number of lines.
   */
  maxLines?: number;

  /**
   * Include line numbers in code block.
   */
  showLineNumbers?: boolean;
};
```

### Example Usage

```tsx
import { CodeSnippet } from "@easypost/easy-ui/CodeSnippet";

function Component() {
  return (
    <CodeSnippet
      code={`console.log("Hello world!");`}
      language="javascript"
    >
  );
}
```

_With line numbers:_

```tsx
import { CodeSnippet } from "@easypost/easy-ui/CodeSnippet";

function Component() {
  return (
    <CodeSnippet
      code={`console.log("Hello world!");`}
      language="javascript"
      showLineNumbers
    >
  );
}
```

_With max lines:_

```tsx
import { CodeSnippet } from "@easypost/easy-ui/CodeSnippet";

function Component() {
  return (
    <CodeSnippet
      code={`const EasyPostClient = require('@easypost/api');

const client = new EasyPostClient(process.env.EASYPOST_API_KEY);

(async () => {
  const tracker = await client.Tracker.create({
    tracking_code: 'EZ1000000001',
    carrier: 'USPS',
  });

  console.log(tracker);
})();`}
      language="javascript"
      maxLines={10}
    >
  );
}
```

### Anatomy

`CodeSnippet` will render a lightweight `SyntaxHighlighter` component that wraps `PrismLight` from `react-syntax-highlighter`. It will be wrapped in Easy UI's `Card` component.

```tsx
export function CodeSnippet() {
  const { code, language, maxLines, showLineNumbers } = props;
  const syntaxTheme = buildTheme();
  return (
    <Card background="primary">
      <div className={styles.CodeSnippet}>
        <SyntaxHighlighter
          language={language}
          style={syntaxTheme}
          showLineNumbers={showLineNumbers}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </Card>
  );
}
```

_SyntaxHighlighter:_

```tsx
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";

import csharp from "react-syntax-highlighter/dist/esm/languages/prism/csharp";
import shell from "react-syntax-highlighter/dist/esm/languages/prism/shell-session";
import go from "react-syntax-highlighter/dist/esm/languages/prism/go";
import java from "react-syntax-highlighter/dist/esm/languages/prism/java";
import javascript from "react-syntax-highlighter/dist/esm/languages/prism/javascript";
import json from "react-syntax-highlighter/dist/esm/languages/prism/json";
import php from "react-syntax-highlighter/dist/esm/languages/prism/php";
import python from "react-syntax-highlighter/dist/esm/languages/prism/python";
import ruby from "react-syntax-highlighter/dist/esm/languages/prism/ruby";

SyntaxHighlighter.registerLanguage(SnippetLanguage.CSHARP, csharp);
SyntaxHighlighter.registerLanguage(SnippetLanguage.GO, go);
SyntaxHighlighter.registerLanguage(SnippetLanguage.JAVA, java);
SyntaxHighlighter.registerLanguage(SnippetLanguage.JAVASCRIPT, javascript);
SyntaxHighlighter.registerLanguage(SnippetLanguage.JSON, json);
SyntaxHighlighter.registerLanguage(SnippetLanguage.PHP, php);
SyntaxHighlighter.registerLanguage(SnippetLanguage.PYTHON, python);
SyntaxHighlighter.registerLanguage(SnippetLanguage.RUBY, ruby);
SyntaxHighlighter.registerLanguage(SnippetLanguage.SHELL, shell);

export { SyntaxHighlighter, SnippetLanguage };
```

---

## Behavior

### Accessibility

- No accessibility concerns internal to the component.
- Consumers should consider providing a descriptive label such as the current filename or step in a process to clarify the purpose of the `CodeSnippet`.

### Dependencies

- Easy UI `Card` component
- `react-syntax-highlighter` which uses a lightweight version of `Prism`
