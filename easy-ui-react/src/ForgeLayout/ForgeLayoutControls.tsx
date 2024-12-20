import React, { ReactNode, useMemo, useState, Fragment } from "react";
import { Button, Dialog, DialogTrigger, Popover } from "react-aria-components";
import ArrowBackIcon from "@easypost/easy-ui-icons/ArrowBack";
import SearchIcon from "@easypost/easy-ui-icons/Search";
import ExpandMoreIcon400 from "@easypost/easy-ui-icons/ExpandMore400";
import { useForgeLayout } from "./ForgeLayout";
import type { NavState } from "./ForgeLayout";
import { useForgeLayoutHeader } from "./ForgeLayoutHeader";
import { UnstyledButton } from "../UnstyledButton";
import type { UnstyledButtonProps } from "../UnstyledButton";
import { Text } from "../Text";
import { Icon } from "../Icon";
import {
  RadioGroup,
  RadioGroupItemProps,
  useRadioGroupContext,
} from "../RadioGroup";
import type { TextFieldProps } from "../TextField";
import { TextField } from "../TextField";
import { HorizontalStack } from "../HorizontalStack";
import { VerticalStack } from "../VerticalStack";
import { flattenChildren } from "../utilities/react";
import { classNames } from "../utilities/css";

import styles from "./ForgeLayoutControls.module.scss";

const TEST_MODE = "Test";
const PRODUCTION_MODE = "Production";

export type ForgeLayoutControlsProps = {
  /** Controls children. */
  children: ReactNode;

  /**
   * Display state of the nav menu for when these controls show.
   *
   * @default expanded
   */
  visibleWhenNavStateIs?: NavState;
};

export function ForgeLayoutControls(props: ForgeLayoutControlsProps) {
  const { navState } = useForgeLayout();
  const { areControlsGrouped } = useForgeLayoutHeader();
  const { children, visibleWhenNavStateIs = "expanded" } = props;

  if (navState !== visibleWhenNavStateIs) {
    return null;
  }

  if (areControlsGrouped) {
    return <div className={styles.controls}>{children}</div>;
  }

  return (
    <>
      {areControlsGrouped ? (
        <div className={styles.controls}>{children}</div>
      ) : (
        <>{children}</>
      )}
    </>
  );
}

export type ForgeLayoutBreadcrumbsNavigationProps = {
  /** Renders ForgeLayout.BackButton and ForgeLayout.Breadcrumbs  */
  children?: ReactNode;
};

export function ForgeLayoutBreadcrumbsNavigation(
  props: ForgeLayoutBreadcrumbsNavigationProps,
) {
  const { children } = props;
  const { backButton, breadcrumbs } = useMemo(() => {
    const breadcrumbNavigationChildren = flattenChildren(children);
    const backButton =
      breadcrumbNavigationChildren.length > 0
        ? breadcrumbNavigationChildren[0]
        : null;

    const breadcrumbs =
      breadcrumbNavigationChildren.length > 1
        ? breadcrumbNavigationChildren[1]
        : null;

    if (!backButton || !breadcrumbs) {
      throw new Error(
        "ForgeLayout.BreadcrumbNavigation must contain ForgeLayout.BackButton and ForgeLayout.Breadcrumbs",
      );
    }
    return {
      backButton,
      breadcrumbs,
    };
  }, [children]);

  return (
    <div className={styles.breadcrumbNavigationContainer}>
      <div className={styles.backButtonContainer}>{backButton}</div>
      <div className={styles.breadcrumbsContainer}>{breadcrumbs}</div>
    </div>
  );
}

export function ForgeLayoutBackButton(props: UnstyledButtonProps) {
  const { children, ...restButtonProps } = props;

  return (
    <UnstyledButton {...restButtonProps} className={styles.backButton}>
      <Icon symbol={ArrowBackIcon} size="sm" />
      <Text variant="subtitle1">{children}</Text>
    </UnstyledButton>
  );
}

export type ForgeLayoutBreadcrumbsProps = {
  /** Renders breadcrumbs */
  children?: ReactNode;
};

export function ForgeLayoutBreadcrumbs(props: ForgeLayoutBreadcrumbsProps) {
  const { children } = props;

  const breadcrumbs = useMemo(() => flattenChildren(children), [children]);

  return (
    <HorizontalStack blockAlign="center" gap="0.5">
      {breadcrumbs.map((breadcrumb, idx) => {
        if (idx === 0) {
          return <Fragment key={idx}>{breadcrumb}</Fragment>;
        } else {
          return (
            <Fragment key={idx}>
              <ForgeLayoutBreadcrumb key={idx}>{">"}</ForgeLayoutBreadcrumb>
              {breadcrumb}
            </Fragment>
          );
        }
      })}
    </HorizontalStack>
  );
}

export type ForgeLayoutBreadcrumbProps = {
  /** Breadcrum content */
  children?: ReactNode;
};

export function ForgeLayoutBreadcrumb(props: ForgeLayoutBreadcrumbProps) {
  const { children } = props;

  return (
    <Text variant="body1" color="neutral.700">
      {children}
    </Text>
  );
}

export type ForgeLayoutModeSwitcherProps = {
  /** Mode change callback function */
  onModeChange?: (value: string) => void;
};

export function ForgeLayoutModeSwitcher(props: ForgeLayoutModeSwitcherProps) {
  const { onModeChange } = props;
  const { mode } = useForgeLayout();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DialogTrigger>
      <Button
        className={classNames(
          styles.trigger,
          isOpen && styles.triggerPopoverOpen,
        )}
        onPress={() => setIsOpen(true)}
      >
        <Text
          variant="subtitle1"
          color={mode === "test" ? "warning.600" : "positive.600"}
          truncate
        >
          {mode === "test" ? TEST_MODE : PRODUCTION_MODE}
        </Text>
        <Icon symbol={ExpandMoreIcon400} size="md" color="neutral.500" />
      </Button>
      <Popover
        className={styles.popover}
        offset={2}
        crossOffset={102}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
      >
        <Dialog>
          <VerticalStack gap="1">
            <Text variant="subtitle1" color="neutral.800">
              Instance Switcher
            </Text>
            <RadioGroup
              aria-label="Select a mode"
              onChange={onModeChange}
              value={mode}
            >
              <ForgeLayoutModeSwitcherRadioGroupItem value="test" />
              <ForgeLayoutModeSwitcherRadioGroupItem value="production" />
            </RadioGroup>
          </VerticalStack>
        </Dialog>
      </Popover>
    </DialogTrigger>
  );
}

function ForgeLayoutModeSwitcherRadioGroupItem(
  props: Omit<RadioGroupItemProps, "children">,
) {
  const { value, ...restProps } = props;
  const state = useRadioGroupContext();
  const isSelected = value === state.selectedValue;
  return (
    <RadioGroup.Item value={value} {...restProps}>
      <VerticalStack>
        <Text
          variant="subtitle2"
          color={isSelected ? "primary.800" : "primary.700"}
        >
          {value === "test" ? TEST_MODE : PRODUCTION_MODE}
        </Text>
        <Text variant="overline">
          View data using the{" "}
          <Text color={value === "test" ? "warning.600" : "positive.600"}>
            {value === "test"
              ? TEST_MODE.toUpperCase()
              : PRODUCTION_MODE.toUpperCase()}{" "}
            API{" "}
          </Text>
          keys
        </Text>
      </VerticalStack>
    </RadioGroup.Item>
  );
}

export function ForgeLayoutSearch(props: TextFieldProps) {
  const { "aria-label": ariaLabel = "Search for content", ...textFieldProps } =
    props;
  return (
    <div className={styles.searchContainer}>
      <TextField
        size="sm"
        type="search"
        aria-label={ariaLabel}
        placeholder="/ search"
        iconAtStart={SearchIcon}
        {...textFieldProps}
      />
    </div>
  );
}
