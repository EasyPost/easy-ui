# `CodeBlock` Component Specification

## Design

`CodeBlock` wraps one or more `CodeSnippet`s with a header to allow the user to switch between them.

`CodeBlock` will be a controlled component. It will require the consumer to provide a selected language and manage its state.

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
      <CodeBlock.Header>Header</CodeVisualizer.Header>
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
