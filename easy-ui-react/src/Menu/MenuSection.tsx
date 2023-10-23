import React, { ReactNode } from "react";
import { useMenuSection, useSeparator } from "react-aria";
import { Node, Section, TreeState } from "react-stately";

import styles from "./Menu.module.scss";
import { MenuItemContent } from "./MenuItem";

export type MenuSectionProps = {
  /** Rendered contents of the item or child items. */
  children: ReactNode;

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
  const { itemProps, groupProps } = useMenuSection({
    "aria-label": section["aria-label"],
  });
  const { separatorProps } = useSeparator({ elementType: "li" });

  return (
    <>
      {section.key !== state.collection.getFirstKey() &&
        section.props.children && (
          <li {...separatorProps} className={styles.separator} />
        )}
      <li {...itemProps}>
        {section.hasChildNodes && (
          <ul {...groupProps} className={styles.sectionList}>
            {[...section.childNodes].map((item) => {
              return (
                <MenuItemContent key={item.key} item={item} state={state} />
              );
            })}
          </ul>
        )}
      </li>
    </>
  );
}
