import SearchIcon from "@easypost/easy-ui-icons/Search";
import tokens from "@easypost/easy-ui-tokens/js/tokens";
import React, { useMemo, useState } from "react";
import { useClipboard } from "use-clipboard-copy";
import { Text } from "../Text";
import { TextField } from "../TextField";
import { VerticalStack } from "../VerticalStack";
import { getComponentToken } from "./css";
import { getTokenAliases } from "./tokens";

import styles from "./ColorPalette.module.scss";

const COPIED_TIMEOUT = 2000;

/** Colors defined without a shade are gathered under this heading. */
const STANDALONE_FAMILY = "named";

type Swatch = {
  /** Resolved hex value, e.g. `#164DFF`. */
  hex: string;
  /** Hex value of the shade label drawn on top of `hex`. */
  labelColor: string;
  /** Shade within the family, e.g. `500`. Empty for standalone colors. */
  shade: string;
  /** Full design token name, e.g. `color.blue.500`. */
  token: string;
};

type SwatchFamily = {
  /** Family the swatches belong to, e.g. `blue`. */
  name: string;
  swatches: Swatch[];
};

/**
 * Browse the Easy UI base color palette. Swatches are grouped by family and
 * filterable by name or hex; selecting one copies its hex value.
 *
 * @remarks
 * Documentation-only. Rendered by the `Foundations/Colors` page.
 */
export function ColorPalette() {
  const [filter, setFilter] = useState("");
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const clipboard = useClipboard({ copiedTimeout: COPIED_TIMEOUT });

  const families = useMemo(() => filterFamilies(FAMILIES, filter), [filter]);
  const query = filter.trim();

  return (
    <VerticalStack gap="4">
      <div className={styles.filter}>
        <TextField
          type="search"
          size="sm"
          aria-label="Filter colors"
          placeholder="blue, 500, #FF"
          iconAtStart={SearchIcon}
          value={filter}
          onChange={setFilter}
        />
      </div>
      {families.length === 0 ? (
        <Text variant="body2" color="neutral.600">
          No colors match “{query}”.
        </Text>
      ) : (
        families.map((family) => (
          <VerticalStack key={family.name} gap="1.5">
            <Text as="h3" variant="subtitle2" transform="capitalize">
              {family.name.replace(/_/g, " ")}
            </Text>
            <div className={styles.grid}>
              {family.swatches.map((swatch) => (
                <SwatchButton
                  key={swatch.token}
                  swatch={swatch}
                  isCopied={clipboard.copied && copiedToken === swatch.token}
                  onCopy={() => {
                    clipboard.copy(swatch.hex);
                    setCopiedToken(swatch.token);
                  }}
                />
              ))}
            </div>
          </VerticalStack>
        ))
      )}
      <div aria-live="polite">
        {clipboard.copied && copiedToken && (
          <Text visuallyHidden>Copied {copiedToken}</Text>
        )}
      </div>
    </VerticalStack>
  );
}

ColorPalette.displayName = "ColorPalette";

type SwatchButtonProps = {
  isCopied: boolean;
  onCopy: () => void;
  swatch: Swatch;
};

function SwatchButton({ isCopied, onCopy, swatch }: SwatchButtonProps) {
  const { hex, labelColor, shade, token } = swatch;
  return (
    <button
      aria-label={`Copy ${hex}, ${token}`}
      className={styles.swatch}
      onClick={onCopy}
      style={{
        ...getComponentToken("color-palette", "chip-background", hex),
        ...getComponentToken("color-palette", "chip-color", labelColor),
      }}
    >
      <span className={styles.chip}>{shade}</span>
      <span className={styles.meta}>
        <Text variant="caption2" color="neutral.600" truncate>
          {token}
        </Text>
        <span className={styles.hex}>{isCopied ? "Copied!" : hex}</span>
      </span>
    </button>
  );
}

/**
 * Gathers the base color tokens into families of shades, with any color
 * defined without a shade grouped at the end.
 */
function buildFamilies(): SwatchFamily[] {
  const colors: Record<string, string | number> = tokens;
  const families: SwatchFamily[] = [];
  const standalone: Swatch[] = [];

  for (const alias of getTokenAliases(tokens, "color.{alias}")) {
    const token = `color.${alias}`;
    const hex = String(colors[token]).toUpperCase();
    const labelColor = getLabelColor(hex);
    const separator = alias.indexOf(".");

    if (separator === -1) {
      standalone.push({ hex, labelColor, shade: "", token });
      continue;
    }

    const name = alias.slice(0, separator);
    const shade = alias.slice(separator + 1);
    const swatch = { hex, labelColor, shade, token };
    const family = families.find((candidate) => candidate.name === name);
    if (family) {
      family.swatches.push(swatch);
    } else {
      families.push({ name, swatches: [swatch] });
    }
  }

  // Numeric-looking shades ("900", "050") come back from the token map in
  // insertion order rather than scale order, so sort explicitly: dark to light.
  for (const family of families) {
    family.swatches.sort(
      (a, b) => parseInt(b.shade, 10) - parseInt(a.shade, 10),
    );
  }

  return standalone.length === 0
    ? families
    : [...families, { name: STANDALONE_FAMILY, swatches: standalone }];
}

/** Narrows the palette to swatches matching a token name or hex substring. */
function filterFamilies(families: SwatchFamily[], filter: string) {
  const query = filter.trim().toLowerCase();
  if (!query) {
    return families;
  }
  return families
    .map((family) => ({
      ...family,
      swatches: family.swatches.filter((swatch) =>
        `${swatch.token} ${swatch.hex}`.toLowerCase().includes(query),
      ),
    }))
    .filter((family) => family.swatches.length > 0);
}

/** WCAG relative luminance of a `#rrggbb` color. */
function getLuminance(hex: string) {
  const [red, green, blue] = [1, 3, 5]
    .map((index) => parseInt(hex.slice(index, index + 2), 16) / 255)
    .map((channel) =>
      channel <= 0.03928
        ? channel / 12.92
        : Math.pow((channel + 0.055) / 1.055, 2.4),
    );
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

/** WCAG contrast ratio between two luminances. */
function getContrast(a: number, b: number) {
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

const DARK_LABEL = tokens["color.gray.800"];
const LIGHT_LABEL = tokens["color.gray.000"];
const DARK_LABEL_LUMINANCE = getLuminance(DARK_LABEL);
const LIGHT_LABEL_LUMINANCE = getLuminance(LIGHT_LABEL);

/**
 * Picks whichever label color contrasts better against a swatch. A fixed
 * luminance threshold leaves mid-range shades under 3:1, so compare directly.
 */
function getLabelColor(hex: string) {
  const luminance = getLuminance(hex);
  return getContrast(luminance, DARK_LABEL_LUMINANCE) >=
    getContrast(luminance, LIGHT_LABEL_LUMINANCE)
    ? DARK_LABEL
    : LIGHT_LABEL;
}

// Declared last so every constant the build reads is already initialized.
const FAMILIES = buildFamilies();
