import { IconSymbol } from "../types";

// Named `.tsx` despite holding no JSX so it stays out of the published package:
// the build's entry glob covers `src/utilities/*.ts` only.

export type GalleryIcon = {
  /** React component that renders the icon's SVG. */
  Component: IconSymbol;
  /** Icon name as it appears in the import path, e.g. `AccountBalance`. */
  name: string;
};

/**
 * Reads the published icons out of the icon package.
 *
 * @remarks
 * Reads the package's build output rather than its `src` because only the
 * build turns each SVG into a React component.
 */
function buildIcons(): GalleryIcon[] {
  const modules: Record<string, { default?: IconSymbol }> = import.meta.glob(
    "../../../easy-ui-icons/dist/*.mjs",
    { eager: true },
  );
  const icons: GalleryIcon[] = [];

  for (const [path, module] of Object.entries(modules)) {
    const { default: Component } = module;
    if (!Component) {
      continue;
    }
    icons.push({
      Component,
      name: path.slice(path.lastIndexOf("/") + 1, -".mjs".length),
    });
  }

  // The glob returns paths in directory order, which is case-sensitive, so
  // sort explicitly to keep consumers' alphabetical grouping in reading order.
  return icons.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Every icon published by `@easypost/easy-ui-icons`, sorted by name.
 *
 * @remarks
 * Documentation-only. Shared by the `Foundations/Icons` page and `Icon`'s
 * `Gallery` story.
 */
export const galleryIcons = buildIcons();
