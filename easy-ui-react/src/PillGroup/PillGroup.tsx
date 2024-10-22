import React from "react";
import { useListData } from "react-stately";
import type {
  TagGroupProps,
  TagListProps,
  TagRenderProps,
} from "react-aria-components";
import { TagGroup, TagList, Tag, Label, Button } from "react-aria-components";
import CloseIcon from "@easypost/easy-ui-icons/Close";
import { Icon } from "../Icon";
import { Text } from "../Text";
import { IconSymbol } from "../types";
import { getComponentToken, getResponsiveDesignToken } from "../utilities/css";
import styles from "./PillGroup.module.scss";
import { HorizontalStackProps } from "../HorizontalStack";

export function usePillListState<T>(initialItems: T[]) {
  return useListData({ initialItems });
}

export type PillGroupProps<T> = Pick<TagGroupProps, "onRemove"> &
  Pick<TagListProps<T>, "items" | "children"> & {
    /** Label for grouping */
    label: string;
    /** HorizontalStack props except children and as */
    horizontalStackContainerProps?: Omit<
      HorizontalStackProps,
      "children" | "as"
    >;
  };

export function PillGroup<T extends object>(props: PillGroupProps<T>) {
  const { label, items, children, horizontalStackContainerProps = {} } = props;
  const {
    align,
    blockAlign,
    gap,
    wrap = true,
    inline,
  } = horizontalStackContainerProps;

  const style = {
    ...getResponsiveDesignToken("pill-group", "gap", "space", gap),
    ...getComponentToken("pill-group", "align", align),
    ...getComponentToken("pill-group", "block-align", blockAlign),
    ...getComponentToken("pill-group", "wrap", wrap ? "wrap" : "nowrap"),
    ...getComponentToken(
      "pill-group",
      "display",
      inline ? "inline-flex" : "flex",
    ),
  } as React.CSSProperties;
  return (
    <TagGroup {...props}>
      <Text visuallyHidden>
        <Label>{label}</Label>
      </Text>
      <TagList items={items} className={styles.list} style={style}>
        {children}
      </TagList>
    </TagGroup>
  );
}

export type PillProps = {
  /** Left aligned icon */
  icon?: IconSymbol;
  /** Visual label for individual pill */
  label: string;
};

function Pill(props: PillProps) {
  const { label, icon } = props;

  return (
    <Tag textValue={label} className={styles.Pill} {...props}>
      {(renderProps: TagRenderProps) => {
        return (
          <>
            {icon && <Icon size="xs" symbol={icon} color="primary.700" />}
            <Text color="primary.800" variant="subtitle2">
              {label}
            </Text>
            {renderProps.allowsRemoving && (
              <Button className={styles.remove} slot="remove">
                <Icon size="xs" symbol={CloseIcon} color="primary.600" />
              </Button>
            )}
          </>
        );
      }}
    </Tag>
  );
}

PillGroup.Pill = Pill;
