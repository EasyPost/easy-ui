# `CodeVisualizer` Component Specification

## Design

`CodeVisualizer` wraps one or more `CodeBlock`s with a header to allow the user to switch between blocks.

`CodeVisualizer` will be a controlled component. It will require the consumer to provide a selected language and manage its state.

### API

```ts
export type CodeVisualizerProps = {
  /**
   * CodeVisualizer content. This should be a header and collection of snippets.
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

export type CodeVisualizerHeaderProps = {
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

export type CodeVisualizerSnippetProps = {
  /**
   * Code snippet content. This should contain a CodeBlock.
   */
  children: ReactNode;
};
```

### Example Usage

```tsx
import { CodeVisualizer } from "@easypost/easy-ui/CodeBlock";

function Component() {
  const [language, setLanguage] = useState("javascript");
  return (
    <CodeVisualizer language={language} onLanguageChange={setLanguage}>
      <CodeVisualizer.Header>Header</CodeVisualizer.Header>
      <CodeVisualizer.Snippet>
        <CodeBlock
          language="javascript"
          code={``}
          maxLines={12}
          showLineNumbers
        />
      </CodeVisualizer.Snippet>
      <CodeVisualizer.Snippet>
        <CodeBlock language="csharp" code={``} maxLines={12} showLineNumbers />
      </CodeVisualizer.Snippet>
    </CodeVisualizer>
  );
}
```

_Custom header color:_

```tsx
import { CodeVisualizer } from "@easypost/easy-ui/CodeBlock";

function Component() {
  const [language, setLanguage] = useState("javascript");
  return (
    <CodeVisualizer language={language} onLanguageChange={setLanguage}>
      <CodeVisualizer.Header color="primary">Header</CodeVisualizer.Header>
      <CodeVisualizer.Snippet>
        <CodeBlock
          language="javascript"
          code={``}
          maxLines={12}
          showLineNumbers
        />
      </CodeVisualizer.Snippet>
      <CodeVisualizer.Snippet>
        <CodeBlock language="csharp" code={``} maxLines={12} showLineNumbers />
      </CodeVisualizer.Snippet>
    </CodeVisualizer>
  );
}
```

_Dynamic snippets:_

```tsx
import { CodeVisualizer } from "@easypost/easy-ui/CodeBlock";

function Component() {
  const [language, setLanguage] = useState("javascript");
  return (
    <CodeVisualizer language={language} onLanguageChange={setLanguage}>
      <CodeVisualizer.Header>Header</CodeVisualizer.Header>
      {Object.entries(getSnippets()).map(([language, code]) => (
        <CodeVisualizer.Snippet key={language}>
          <CodeBlock
            language={language}
            code={code}
            maxLines={12}
            showLineNumbers
          />
        </CodeVisualizer.Snippet>
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
