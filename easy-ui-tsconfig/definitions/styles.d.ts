type CSSModuleClasses = { readonly [key: string]: string };

declare module "*.module.css" {
  const classNames: CSSModuleClasses;
  export default classNames;
}

declare module "*.module.scss" {
  const classNames: CSSModuleClasses;
  export default classNames;
}
