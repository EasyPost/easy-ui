import React, { useId } from "react";
import ExpandMoreIcon400 from "@easypost/easy-ui-icons/ExpandMore400";
import { Text } from "../Text";
import { Icon } from "../Icon";
import { Menu } from "../Menu";
import { UnstyledButton } from "../UnstyledButton";
import { HorizontalStack } from "../HorizontalStack";
import { classNames } from "../utilities/css";
import type { PaginationSize } from "./Pagination";
import styles from "./Pagination.module.scss";

export type PaginationRowsPerPageProps = {
  /** The current rows-per-page value. */
  rowsPerPage: number;
  /** The selectable rows-per-page values. */
  options: number[];
  /** Callback when a rows-per-page value is selected. */
  onChange: (rowsPerPage: number) => void;
  /** Whether the control is disabled. */
  isDisabled?: boolean;
  /** Size of the control, matching the parent `Pagination` size. */
  size?: PaginationSize;
};

/**
 * The "Rows Per Page" control rendered at the end of a numbered
 * `<Pagination />` toolbar. Internal to `Pagination`; not exported from the
 * package.
 */
export function PaginationRowsPerPage(props: PaginationRowsPerPageProps) {
  const { rowsPerPage, options, onChange, isDisabled, size = "md" } = props;

  const textVariant = size === "sm" ? "body2" : "body1";
  const labelId = useId();
  const valueId = useId();

  return (
    <div className={styles.rowsPerPage}>
      <Text id={labelId} variant={textVariant} color="neutral.900">
        Rows Per Page:
      </Text>
      <Menu isDisabled={isDisabled}>
        <Menu.Trigger>
          <UnstyledButton
            aria-labelledby={`${labelId} ${valueId}`}
            className={classNames(
              styles.rowsPerPageButton,
              size === "sm" && styles.rowsPerPageButtonSm,
            )}
            isDisabled={isDisabled}
          >
            <HorizontalStack blockAlign="center" wrap={false}>
              <Text id={valueId} variant={textVariant}>
                {rowsPerPage}
              </Text>
              <Icon symbol={ExpandMoreIcon400} size="2xs" />
            </HorizontalStack>
          </UnstyledButton>
        </Menu.Trigger>
        <Menu.Overlay onAction={(key) => onChange(Number(key))}>
          {options.map((option) => (
            <Menu.Item key={option} aria-label={`${option} rows per page`}>
              <Text variant="body2" color="neutral.900">
                {option}
              </Text>
            </Menu.Item>
          ))}
        </Menu.Overlay>
      </Menu>
    </div>
  );
}
