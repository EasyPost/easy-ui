import SearchIcon from "@easypost/easy-ui-icons/Search";
import React, { useCallback, useState } from "react";
import { useClipboard } from "use-clipboard-copy";
import { Box } from "../Box";
import { HorizontalGrid } from "../HorizontalGrid";
import { Icon } from "../Icon";
import { Text } from "../Text";
import { TextField } from "../TextField";
import { VerticalStack } from "../VerticalStack";
import { GalleryIcon, galleryIcons } from "./icons";

import styles from "./IconGallery.module.scss";

const COPIED_TIMEOUT = 2000;

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
  const { copied, copy } = useClipboard({ copiedTimeout: COPIED_TIMEOUT });

  // Stable so a copy only re-renders the tile that was clicked, not all 161.
  const onCopy = useCallback(
    (name: string) => {
      copy(getImportStatement(name));
      setCopiedName(name);
    },
    [copy],
  );

  const query = filter.trim();
  const groups = groupByLetter(filterIcons(galleryIcons, query));

  return (
    <VerticalStack gap="4">
      <Box maxWidth={320}>
        <TextField
          type="search"
          size="sm"
          aria-label="Filter icons"
          placeholder="arrow, check, account balance"
          iconAtStart={SearchIcon}
          value={filter}
          onChange={setFilter}
        />
      </Box>
      {groups.length === 0 ? (
        <Text variant="body2" color="neutral.600">
          No icons match “{query}”.
        </Text>
      ) : (
        groups.map(([letter, icons]) => (
          <VerticalStack key={letter} gap="1.5">
            <Text as="h3" variant="subtitle2">
              {letter}
            </Text>
            <HorizontalGrid
              columns="repeat(auto-fill, minmax(112px, 1fr))"
              gap="1"
            >
              {icons.map((icon) => (
                <IconTile
                  key={icon.name}
                  icon={icon}
                  isCopied={copied && copiedName === icon.name}
                  onCopy={onCopy}
                />
              ))}
            </HorizontalGrid>
          </VerticalStack>
        ))
      )}
      <div aria-live="polite">
        {copied && copiedName && (
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
  onCopy: (name: string) => void;
};

/**
 * Memoized because copying re-renders the gallery twice — once on the click and
 * again when the copied state times out — and only one tile's props change.
 */
const IconTile = React.memo(function IconTile({
  icon: { Component, name },
  isCopied,
  onCopy,
}: IconTileProps) {
  return (
    <button
      aria-label={`Copy import for ${name}`}
      className={styles.tile}
      onClick={() => onCopy(name)}
    >
      <Icon symbol={Component} size="lg" />
      <Text variant="caption2" color="neutral.600" alignment="center" breakWord>
        {isCopied ? "Copied!" : <WrappableName name={name} />}
      </Text>
    </button>
  );
});

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
 * Narrows the gallery to icons matching a name substring. Whitespace in the
 * query is dropped, so a name's words can be spaced out — "account balance"
 * finds `AccountBalance`, "check 600" finds `Check600`.
 */
function filterIcons(icons: GalleryIcon[], query: string) {
  const needle = query.replace(/\s+/g, "").toLowerCase();
  if (!needle) {
    return icons;
  }
  return icons.filter((icon) => icon.name.toLowerCase().includes(needle));
}

/** Gathers icons into `[letter, icons]` entries, preserving name order. */
function groupByLetter(icons: GalleryIcon[]) {
  const groups = new Map<string, GalleryIcon[]>();
  for (const icon of icons) {
    const letter = icon.name.slice(0, 1).toUpperCase();
    const group = groups.get(letter);
    if (group) {
      group.push(icon);
    } else {
      groups.set(letter, [icon]);
    }
  }
  return [...groups];
}
