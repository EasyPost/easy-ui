import React, { ReactNode } from "react";
import { useListBoxSection, useSeparator } from "react-aria";
import { Node, Section, SelectState } from "react-stately";
import { SelectOptionContent } from "./SelectOption";
import styles from "./Select.module.scss";

export type SelectSectionProps = {
  /** Rendered contents of the item or child items. */
  children: ReactNode;

  /** An accessibility label for the section. */
  "aria-label"?: string;
};

/**
 * @privateRemarks
 * This is what is exposed as `<Select.Section />`. This is a wrapper around
 * @react-stately's Section collection component to control the props that are
 * allowed for the component.
 */
export function SelectSection(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _props: SelectSectionProps,
) {
  return null;
}
Object.assign(SelectSection, Section);

type SelectSectionContentProps<T> = {
  section: Node<T>;
  state: SelectState<T>;
};

export function SelectSectionContent<T>({
  section,
  state,
}: SelectSectionContentProps<T>) {
  const { itemProps, groupProps } = useListBoxSection({
    "aria-label": section["aria-label"],
  });
  const { separatorProps } = useSeparator({ elementType: "li" });
  return (
    <>
      {section.key !== state.collection.getFirstKey() && (
        <li {...separatorProps} className={styles.separator} />
      )}
      <li {...itemProps}>
        {section.hasChildNodes && (
          <ul {...groupProps} className={styles.sectionList}>
            {[...section.childNodes].map((item) => {
              return (
                <SelectOptionContent key={item.key} item={item} state={state} />
              );
            })}
          </ul>
        )}
      </li>
    </>
  );
}
