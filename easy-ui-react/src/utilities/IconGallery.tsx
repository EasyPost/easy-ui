import SearchIcon from "@easypost/easy-ui-icons/Search";
import React, { useMemo, useState } from "react";
import { useClipboard } from "use-clipboard-copy";
import { Icon } from "../Icon";
import { Text } from "../Text";
import { TextField } from "../TextField";
import { IconSymbol } from "../types";
import { VerticalStack } from "../VerticalStack";

import styles from "./IconGallery.module.scss";

const COPIED_TIMEOUT = 2000;

export type GalleryIcon = {
  /** React component that renders the icon's SVG. */
  Component: IconSymbol;
  /** Icon name as it appears in the import path, e.g. `AccountBalance`. */
  name: string;
  /** Lowercased haystack the filter matches against. */
  searchText: string;
};

type IconGroup = {
  /** Letter the names in the group start with, e.g. `A`. */
  letter: string;
  icons: GalleryIcon[];
};

/**
 * Browse the icons published by `@easypost/easy-ui-icons`. Icons are grouped
 * alphabetically and filterable by name; selecting one copies its import
 * statement.
 *
 * @remarks
 * Documentation-only. Rendered by the `Foundations/Icons` page.
 */
export function IconGallery() {
  const [filter, setFilter] = useState("");
  const [copiedName, setCopiedName] = useState<string | null>(null);
  const clipboard = useClipboard({ copiedTimeout: COPIED_TIMEOUT });

  const groups = useMemo(() => filterGroups(GROUPS, filter), [filter]);
  const query = filter.trim();

  return (
    <VerticalStack gap="4">
      <div className={styles.filter}>
        <TextField
          type="search"
          size="sm"
          aria-label="Filter icons"
          placeholder="arrow, check, account balance"
          iconAtStart={SearchIcon}
          value={filter}
          onChange={setFilter}
        />
      </div>
      {groups.length === 0 ? (
        <Text variant="body2" color="neutral.600">
          No icons match “{query}”.
        </Text>
      ) : (
        groups.map((group) => (
          <VerticalStack key={group.letter} gap="1.5">
            <Text as="h3" variant="subtitle2">
              {group.letter}
            </Text>
            <div className={styles.grid}>
              {group.icons.map((icon) => (
                <IconTile
                  key={icon.name}
                  icon={icon}
                  isCopied={clipboard.copied && copiedName === icon.name}
                  onCopy={() => {
                    clipboard.copy(getImportStatement(icon.name));
                    setCopiedName(icon.name);
                  }}
                />
              ))}
            </div>
          </VerticalStack>
        ))
      )}
      <div aria-live="polite">
        {clipboard.copied && copiedName && (
          <Text visuallyHidden>Copied import for {copiedName}</Text>
        )}
      </div>
    </VerticalStack>
  );
}

IconGallery.displayName = "IconGallery";

type IconTileProps = {
  icon: GalleryIcon;
  isCopied: boolean;
  onCopy: () => void;
};

function IconTile({ icon, isCopied, onCopy }: IconTileProps) {
  const { Component, name } = icon;
  return (
    <button
      aria-label={`Copy import for ${name}`}
      className={styles.tile}
      onClick={onCopy}
    >
      <span className={styles.glyph}>
        <Icon symbol={Component} size="lg" />
      </span>
      <span className={styles.name}>
        {isCopied ? "Copied!" : <WrappableName name={name} />}
      </span>
    </button>
  );
}

/**
 * Renders a name with a break opportunity before each of its words, so that a
 * name too wide for its tile wraps as `Account` / `BalanceWallet` rather than
 * mid-word.
 */
function WrappableName({ name }: { name: string }) {
  return name.split(/(?=[A-Z])/).map((word, index) => (
    <React.Fragment key={index}>
      {index > 0 && <wbr />}
      {word}
    </React.Fragment>
  ));
}

/** The import a consumer writes to use the icon, following repo convention. */
function getImportStatement(name: string) {
  return `import ${name}Icon from "@easypost/easy-ui-icons/${name}";`;
}

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
    const name = path.slice(path.lastIndexOf("/") + 1, -".mjs".length);
    icons.push({ Component, name, searchText: getSearchText(name) });
  }

  // The glob returns paths in directory order, which is case-sensitive, so
  // sort explicitly to keep the alphabet groups below in reading order.
  return icons.sort((a, b) => a.name.localeCompare(b.name));
}

/** Gathers the icons into groups by first letter. */
function groupIcons(icons: GalleryIcon[]): IconGroup[] {
  const groups: IconGroup[] = [];
  for (const icon of icons) {
    const letter = icon.name.slice(0, 1).toUpperCase();
    const group = groups.find((candidate) => candidate.letter === letter);
    if (group) {
      group.icons.push(icon);
    } else {
      groups.push({ letter, icons: [icon] });
    }
  }
  return groups;
}

/**
 * Lets a filter find an icon by its spaced-out words, so that "account
 * balance" matches `AccountBalance`.
 */
function getSearchText(name: string) {
  return `${name} ${name.replace(/([a-z0-9])([A-Z])/g, "$1 $2")}`.toLowerCase();
}

/** Narrows the gallery to icons matching a name substring. */
function filterGroups(groups: IconGroup[], filter: string) {
  const query = filter.trim().toLowerCase();
  if (!query) {
    return groups;
  }
  return groups
    .map((group) => ({
      ...group,
      icons: group.icons.filter((icon) => icon.searchText.includes(query)),
    }))
    .filter((group) => group.icons.length > 0);
}

// Declared last so every constant the build reads is already initialized.

/** Every icon published by `@easypost/easy-ui-icons`, sorted by name. */
export const galleryIcons = buildIcons();

const GROUPS = groupIcons(galleryIcons);
