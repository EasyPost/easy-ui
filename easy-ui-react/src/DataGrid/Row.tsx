import { FocusableElement, Node } from "@react-types/shared";
import React, {
  PointerEvent as PointerEventType,
  ReactNode,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { mergeProps, useFocusRing, useHover, useTableRow } from "react-aria";
import { TableState } from "react-stately";
import { classNames } from "../utilities/css";
import { EXPAND_COLUMN_KEY } from "./constants";
import { DataGridRowContext } from "./context";

import styles from "./DataGrid.module.scss";

type RowProps<T = object> = {
  children: ReactNode;
  isExpanded: boolean;
  item: Node<T>;
  state: TableState<T>;
};

export function Row({ item, children, state, isExpanded }: RowProps) {
  const isSelected = state.selectionManager.isSelected(item.key);
  const isDisabled = state.disabledKeys.has(item.key);
  const isPendingExpanded = item.value
    ? item.value[EXPAND_COLUMN_KEY as keyof typeof item.value] === true
    : false;

  const ref = useRef(null);
  const { rowProps, isPressed } = useTableRow({ node: item }, state, ref);
  const { isFocusVisible, focusProps } = useFocusRing();
  const { isHovered, hoverProps } = useHover({});

  // There's an issue in react-aria where a pointer leave event won't get
  // triggered on menu open. This allows for manually triggering it in our
  // menu actions deeper in the tree.
  // https://github.com/adobe/react-spectrum/issues/4951
  const removeHover = useCallback(() => {
    if (!ref.current) {
      return;
    }
    const { onPointerLeave = () => {} } = hoverProps;
    onPointerLeave({
      target: ref.current,
      currentTarget: ref.current,
    } as unknown as PointerEventType<FocusableElement>);
  }, [hoverProps]);

  const context = useMemo(() => {
    return { removeHover };
  }, [removeHover]);

  const className = classNames(
    styles.row,
    isExpanded && styles.rowExpanded,
    isHovered && styles.rowHovered,
    isFocusVisible && styles.rowFocused,
    isSelected && styles.rowSelected,
    isPressed && styles.rowPressed,
    isDisabled && styles.rowDisabled,
  );

  return (
    <DataGridRowContext.Provider value={context}>
      <div
        ref={ref}
        {...mergeProps(rowProps, focusProps, hoverProps)}
        className={className}
        data-ezui-data-grid-expanded-row={isPendingExpanded}
        data-ezui-data-grid-row="true"
      >
        {children}
      </div>
    </DataGridRowContext.Provider>
  );
}
