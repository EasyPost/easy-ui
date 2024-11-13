import React from "react";
import ExpandMoreIcon400 from "@easypost/easy-ui-icons/ExpandMore400";
import { Text } from "../Text";
import { Icon } from "../Icon";
import { Menu } from "../Menu";
import { UnstyledButton } from "../UnstyledButton";
import { HorizontalStack } from "../HorizontalStack";
import styles from "./Pagination.module.scss";

export type PaginationDropdownProps = {
  /**
   * The current page.
   */
  page: number;
  /**
   * The total number of pages.
   */
  count: number;
  /**
   * Callback when select page from dropdown.
   */
  onSelect: (key: number) => void;
  /**
   * Whether the PaginationDropdown should be disabled.
   */
  isDisabled?: boolean;
};

export function PaginationDropdown(props: PaginationDropdownProps) {
  const { page, count, onSelect, isDisabled } = props;

  return (
    <Menu isDisabled={isDisabled}>
      <Menu.Trigger>
        <UnstyledButton
          aria-label="dropdown"
          className={styles.menuButton}
          isDisabled={isDisabled}
        >
          <HorizontalStack blockAlign="center">
            <Text
              variant="body2"
              color={isDisabled ? "neutral.400" : "neutral.900"}
            >
              {`${page} of ${count}`}
            </Text>
            <Icon
              symbol={ExpandMoreIcon400}
              size="2xs"
              color={isDisabled ? "neutral.400" : "neutral.900"}
            />
          </HorizontalStack>
        </UnstyledButton>
      </Menu.Trigger>
      <Menu.Overlay onAction={(key) => onSelect(Number(key))}>
        {numberToArray(count).map((pageNumber) => (
          <Menu.Item key={pageNumber} arial-label={`page ${pageNumber}`}>
            <Text
              variant="body2"
              color="neutral.900"
            >{`${pageNumber} of ${count}`}</Text>
          </Menu.Item>
        ))}
      </Menu.Overlay>
    </Menu>
  );
}

function numberToArray(num: number) {
  return Array.from({ length: num }, (_, i) => i + 1);
}

PaginationDropdown.displayName = "Pagination.Dropdown";
