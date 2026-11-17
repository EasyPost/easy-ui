// `@types/react-syntax-highlighter` declares its deep ESM paths without a file
// extension, but plain-Node ESM (SSR, test runners that don't bundle
// node_modules) needs the `.js`, because react-syntax-highlighter has no
// `exports` map. Re-declare the `.js` paths in terms of the extensionless ones.

declare module "react-syntax-highlighter/dist/esm/prism-light.js" {
  export { default } from "react-syntax-highlighter/dist/esm/prism-light";
}

declare module "react-syntax-highlighter/dist/esm/languages/prism/*.js" {
  const language: unknown;
  export default language;
}
