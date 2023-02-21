declare module "*.module.css" {
  const classNames: { [key: string]: string };
  export default classNames;
}

declare module "*.module.scss" {
  const classNames: { [key: string]: string };
  export default classNames;
}
