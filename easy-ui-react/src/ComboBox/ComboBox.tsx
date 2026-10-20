import React, { ReactNode, useContext, useEffect, useRef } from "react";
import {
  ComboBox as AriaComboBox,
  ComboBoxProps as AriaComboBoxProps,
  ComboBoxStateContext,
  Group,
  Input,
  ListBox,
  ListBoxItem,
  ListBoxItemProps,
  Popover,
  Text as AriaText,
} from "react-aria-components";
import { ValidationState } from "@react-types/shared";
import { InputSize } from "../InputField";
import { InputIcon } from "../InputField/InputIcon";
import { Label } from "../InputField/Label";
import { mapIconSize } from "../InputField/utilities";
import {
  DEFAULT_MAX_ITEMS_UNTIL_SCROLL,
  ITEM_HEIGHT,
  Y_PADDING_INSIDE_OVERLAY,
} from "../Menu/utilities";
import { Spinner } from "../Spinner";
import { Text } from "../Text";
import { IconSymbol } from "../types";
import {
  classNames,
  getComponentToken,
  pxToRem,
  variationName,
} from "../utilities/css";
import { useScrollbar } from "../utilities/useScrollbar";

import styles from "./ComboBox.module.scss";

export type ComboBoxSize = InputSize;

export type ComboBoxProps<T extends object> = Omit<
  AriaComboBoxProps<T>,
  | "children"
  | "className"
  | "style"
  | "selectionMode"
  | "isInvalid"
  | "validate"
  | "validationBehavior"
  | "allowsEmptyCollection"
> & {
  /**
   * The options in the list, or a function that renders an option for each
   * of `items` or `defaultItems`. Use `<ComboBox.Option />`.
   */
  children: ReactNode | ((item: T) => ReactNode);
  /** The content to display as the label. */
  label?: ReactNode;
  /**
   * Label text displays with emphasis.
   * @default false
   */
  isLabelEmphasized?: boolean;
  /** Helper text that appears below the input. */
  helperText?: ReactNode;
  /**
   * Error text that appears below the input. Shown in place of `helperText`
   * when `validationState` is `"invalid"`.
   */
  errorText?: ReactNode;
  /**
   * Whether the input should display its "valid" or "invalid" visual styling.
   * @default valid
   */
  validationState?: ValidationState;
  /**
   * Size of the input. Also sizes `iconAtStart` and the loading indicator.
   * @default md
   */
  size?: ComboBoxSize;
  /** Temporary text that occupies the input when it is empty. */
  placeholder?: string;
  /** Left aligned icon on the input. */
  iconAtStart?: IconSymbol;
  /**
   * Whether options are being fetched. Shows a loading indicator at the end
   * of the input; options already in the list stay visible.
   * @default false
   */
  isLoading?: boolean;
  /**
   * Content rendered below the options, such as a "Powered by Google"
   * attribution. It isn't an option: it can't be focused or selected, and it
   * shows only while the list is open.
   */
  footer?: ReactNode;
  /**
   * Maximum number of options to show before the list scrolls.
   * @default 5
   */
  maxItemsUntilScroll?: number;
};

/**
 * A text input with a list of suggestions below it.
 *
 * @remarks
 * Typing filters `defaultItems`, or—for suggestions fetched as the user
 * types—pass `items` along with `inputValue` and `onInputChange`, and set
 * `isLoading` while a request is in flight. With `allowsCustomValue`, text
 * that doesn't match an option is kept as the value.
 *
 * @example
 * ```tsx
 * <ComboBox label="Fruit" defaultItems={fruits}>
 *   {(item) => <ComboBox.Option id={item.id}>{item.name}</ComboBox.Option>}
 * </ComboBox>
 * ```
 *
 * @example
 * _Async suggestions with free text:_
 * ```tsx
 * <ComboBox
 *   aria-label="Street address"
 *   allowsCustomValue
 *   inputValue={street}
 *   onInputChange={setStreet}
 *   items={predictions}
 *   isLoading={isLoading}
 *   onSelectionChange={(key) => key && selectPrediction(key)}
 *   footer={<ComboBox.FooterText>Powered by Google</ComboBox.FooterText>}
 * >
 *   {(item) => (
 *     <ComboBox.Option id={item.place_id}>{item.description}</ComboBox.Option>
 *   )}
 * </ComboBox>
 * ```
 */
export function ComboBox<T extends object>(props: ComboBoxProps<T>) {
  const {
    children,
    label,
    isLabelEmphasized = false,
    helperText,
    errorText,
    validationState = "valid",
    size = "md",
    placeholder,
    iconAtStart,
    isLoading = false,
    footer,
    maxItemsUntilScroll = DEFAULT_MAX_ITEMS_UNTIL_SCROLL,
    isDisabled = false,
    menuTrigger = "input",
    ...comboBoxProps
  } = props;

  const listRef = useRef<HTMLDivElement | null>(null);
  // Set when the user types, cleared whenever the list opens or closes. Lets
  // suggestions that arrive after typing open the list without reopening it
  // after a selection or Escape.
  const hasTypedRef = useRef(false);

  if (!label && !props["aria-label"] && !props["aria-labelledby"]) {
    console.warn("An aria-label must be provided if omitting `label`");
  }

  const popoverStyle = {
    ...getComponentToken("menu", "item_height", `${pxToRem(ITEM_HEIGHT)}rem`),
    ...getComponentToken(
      "menu",
      "padding.y",
      `${pxToRem(Y_PADDING_INSIDE_OVERLAY)}rem`,
    ),
  };

  // Only fetched (controlled) items arrive on their own; React Aria handles
  // `defaultItems`, which it filters as the input changes.
  const { items } = comboBoxProps;
  const hasItems = items !== undefined && Array.from(items).length > 0;

  const hasError = validationState === "invalid";
  const showErrorText = hasError && !!errorText;
  const showHelperText = !showErrorText && !!helperText;

  return (
    <AriaComboBox
      {...comboBoxProps}
      className={styles.root}
      isDisabled={isDisabled}
      isInvalid={hasError}
      validationBehavior="aria"
      menuTrigger={menuTrigger}
      onOpenChange={(isOpen, trigger) => {
        hasTypedRef.current = false;
        comboBoxProps.onOpenChange?.(isOpen, trigger);
      }}
    >
      <OpenOnArrival
        hasTypedRef={hasTypedRef}
        hasItems={hasItems}
        isEnabled={menuTrigger !== "manual"}
      />
      {label && (
        <Label
          fieldSize={size}
          hasError={hasError}
          isLabelEmphasized={isLabelEmphasized}
        >
          {label}
        </Label>
      )}
      <Group className={styles.field} role="presentation">
        {iconAtStart && (
          <InputIcon
            alignment="start"
            size={size}
            isDisabled={isDisabled}
            icon={iconAtStart}
          />
        )}
        <Input
          className={classNames(
            styles.input,
            hasError && styles.errorInput,
            iconAtStart && styles.iconStartInput,
            isLoading && styles.loadingInput,
            styles[variationName("inputSize", size)],
          )}
          placeholder={placeholder}
          onChange={() => {
            hasTypedRef.current = true;
          }}
        />
        {isLoading && (
          <span
            className={classNames(
              styles.loadingIndicator,
              styles[variationName("loadingIndicator", size)],
            )}
          >
            <Spinner
              isIndeterminate
              aria-label="Loading"
              size={mapIconSize(size)}
            />
          </span>
        )}
      </Group>
      {(showErrorText || showHelperText) && (
        <AriaText
          slot={showErrorText ? "errorMessage" : "description"}
          className={styles.caption}
        >
          <Text variant="caption" color={showErrorText ? "danger" : "subdued"}>
            {showErrorText ? errorText : helperText}
          </Text>
        </AriaText>
      )}
      <Popover className={styles.popover} style={popoverStyle}>
        <ScrollContainer
          scrollRef={listRef}
          maxItemsUntilScroll={maxItemsUntilScroll}
        >
          <ListBox className={styles.listBox}>{children}</ListBox>
        </ScrollContainer>
        {footer && (
          <div
            className={styles.footer}
            // Keep focus in the input so pressing the footer doesn't close the list.
            onMouseDown={(e) => e.preventDefault()}
          >
            {footer}
          </div>
        )}
      </Popover>
    </AriaComboBox>
  );
}

/**
 * React Aria opens the list when the input changes and there are options to
 * show. Fetched options arrive after the input changed, so this opens the list
 * when they do, as long as the user has typed since it last opened or closed.
 *
 * Reads `hasItems` from props rather than `state.collection`, which React Aria
 * freezes while the list is closed.
 */
function OpenOnArrival({
  hasTypedRef,
  hasItems,
  isEnabled,
}: {
  hasTypedRef: React.MutableRefObject<boolean>;
  hasItems: boolean;
  isEnabled: boolean;
}) {
  const state = useContext(ComboBoxStateContext);
  const lastInputValueRef = useRef(state?.inputValue);
  useEffect(() => {
    if (!state) {
      return;
    }
    const inputUnchanged = lastInputValueRef.current === state.inputValue;
    lastInputValueRef.current = state.inputValue;
    if (
      isEnabled &&
      inputUnchanged &&
      hasTypedRef.current &&
      state.isFocused &&
      !state.isOpen &&
      hasItems
    ) {
      state.open(null, "input");
    }
  });
  return null;
}

function ScrollContainer({
  scrollRef,
  maxItemsUntilScroll,
  children,
}: {
  scrollRef: React.MutableRefObject<HTMLDivElement | null>;
  maxItemsUntilScroll: number;
  children: ReactNode;
}) {
  useScrollbar(scrollRef, "ezui-os-theme-overlay");
  return (
    <div
      className={styles.scrollContainer}
      ref={scrollRef}
      style={{
        maxHeight:
          ITEM_HEIGHT * maxItemsUntilScroll + Y_PADDING_INSIDE_OVERLAY * 2,
      }}
    >
      {children}
    </div>
  );
}

export type ComboBoxOptionProps = Omit<ListBoxItemProps, "className" | "style">;

function ComboBoxOption(props: ComboBoxOptionProps) {
  const { children, textValue, ...itemProps } = props;
  const isText = typeof children === "string";
  return (
    <ListBoxItem
      {...itemProps}
      textValue={textValue ?? (isText ? children : undefined)}
      className={styles.option}
    >
      {isText ? (
        <Text variant="body1" truncate>
          {children}
        </Text>
      ) : (
        children
      )}
    </ListBoxItem>
  );
}

function ComboBoxFooterText({ children }: { children: ReactNode }) {
  return (
    <Text variant="caption" color="neutral.400">
      {children}
    </Text>
  );
}

/**
 * An option in a `<ComboBox />`. String children are truncated to one line
 * and used as the option's `textValue`; otherwise, set `textValue`, which is
 * the text the input takes when the option is selected.
 */
ComboBox.Option = ComboBoxOption;

/**
 * Text styled for a `<ComboBox />` `footer`, such as an attribution.
 */
ComboBox.FooterText = ComboBoxFooterText;
