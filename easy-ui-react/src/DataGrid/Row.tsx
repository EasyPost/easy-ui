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
  item: Node<T>;
  state: TableState<T>;
  children: ReactNode;
  isExpanded: boolean;
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

  const removeHover = useCallback(() => {
    if (!ref.current) {
      return;
    }
    const { onPointerLeave = () => {} } = hoverProps;
    onPointerLeave(createPointerLeaveEvent(ref.current));
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
        className={className}
        {...mergeProps(rowProps, focusProps, hoverProps)}
        ref={ref}
        data-ezui-data-grid-expanded-row={isPendingExpanded}
        data-ezui-data-grid-row="true"
      >
        {children}
      </div>
    </DataGridRowContext.Provider>
  );
}

function createPointerLeaveEvent(target: HTMLElement) {
  return {
    target,
    currentTarget: target,
  } as unknown as PointerEventType<FocusableElement>;
}
