import React, { ReactNode } from "react";
import { useMenuSection, useSeparator } from "react-aria";
import { Node, Section, TreeState } from "react-stately";

import styles from "./Menu.module.scss";
import { MenuItemContent } from "./MenuItem";
import { Text } from "../Text";

export type MenuSectionProps = {
  /** Rendered contents of the item or child items. */
  children: ReactNode;

  /** A description of the section title */
  title?: string;

  /** An accessibility label for the section. */
  "aria-label"?: string;
};

/**
 * @privateRemarks
 * This is what is exposed as `<Menu.Section />`. This is a wrapper around
 * @react-stately's Section collection component to control the props that are
 * allowed for the component.
 */
export function MenuSection(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _props: MenuSectionProps,
) {
  return null;
}
Object.assign(MenuSection, Section);

type MenuSectionContentProps<T> = {
  section: Node<T>;
  state: TreeState<T>;
};

export function MenuSectionContent<T>({
  section,
  state,
}: MenuSectionContentProps<T>) {
  const { itemProps, headingProps, groupProps } = useMenuSection({
    heading: section.rendered,
    "aria-label": section["aria-label"],
  });
  const { separatorProps } = useSeparator({ elementType: "li" });

  const isNotFirstOrLast =
    section.key !== state.collection.getFirstKey() &&
    section.nextKey !== state.collection.getLastKey();
  const hasContent = section.hasChildNodes || section.rendered;

  return (
    <>
      {isNotFirstOrLast && (
        <li {...separatorProps} className={styles.separator} />
      )}
      {hasContent && (
        <li {...itemProps}>
          {section.hasChildNodes && (
            <>
              {section.rendered && (
                <span {...headingProps} className={styles.sectionTitle}>
                  <Text variant="subtitle1" color="primary.900">
                    {section.rendered}
                  </Text>
                </span>
              )}
              <ul {...groupProps} className={styles.sectionList}>
                {[...section.childNodes].map((item) => {
                  return (
                    <MenuItemContent key={item.key} item={item} state={state} />
                  );
                })}
              </ul>
            </>
          )}
        </li>
      )}
    </>
  );
}
