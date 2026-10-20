import React, {
  MutableRefObject,
  ReactNode,
  useContext,
  useEffect,
  useRef,
} from "react";
import {
  ComboBox as AriaComboBox,
  ComboBoxProps as AriaComboBoxProps,
  ComboBoxStateContext,
  Group,
  Input,
  Key,
  ListBox,
  ListBoxItem,
  ListBoxSection,
  Popover,
  TextContext,
  useSlottedContext,
} from "react-aria-components";
import { InputSize } from "../InputField";
import { InputCaption } from "../InputField/InputCaption";
import { InputIcon } from "../InputField/InputIcon";
import { Label } from "../InputField/Label";
import {
  logWarningForMissingAriaLabel,
  mapIconSize,
} from "../InputField/utilities";
import {
  DEFAULT_MAX_ITEMS_UNTIL_SCROLL,
  ITEM_HEIGHT,
  OVERLAY_OFFSET,
  OVERLAY_PADDING_FROM_CONTAINER,
  Y_PADDING_INSIDE_OVERLAY,
} from "../Menu/utilities";
import { Spinner } from "../Spinner";
import { Text } from "../Text";
import { IconSymbol } from "../types";
import {
  classNames,
  getComponentToken,
  getResponsiveValue,
  pxToRem,
  variationName,
} from "../utilities/css";
import { useScrollbar } from "../utilities/useScrollbar";

import styles from "./ComboBox.module.scss";

export type ComboBoxSize = InputSize;
export type ValidationState = "valid" | "invalid";

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
   * The options: `<ComboBox.Option />`s and `<ComboBox.Section />`s, or a
   * function that renders a `<ComboBox.Option />` for each of `items` or
   * `defaultItems`.
   */
  children: ReactNode | ((item: T) => ReactNode);
  /**
   * Accessibility label for the combo box.
   */
  "aria-label"?: string;
  /**
   * Whether the combo box is disabled.
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Whether user input is required on the combo box before form submission.
   * @default false
   */
  isRequired?: boolean;
  /**
   * Whether the input should display its "valid" or "invalid" visual styling.
   * @default valid
   */
  validationState?: ValidationState;
  /**
   * Label text displays with emphasis.
   * @default false
   */
  isLabelEmphasized?: boolean;
  /**
   * Size affects the overall size of the combo box, but it also influences
   * the size of iconAtStart and the loading indicator.
   * @default md
   */
  size?: ComboBoxSize;
  /** The content to display as the label. */
  label?: ReactNode;
  /** Error text that appears below the combo box. */
  errorText?: ReactNode;
  /** Helper text that appears below the combo box. */
  helperText?: ReactNode;
  /** Temporary text that occupies the combo box when it is empty. */
  placeholder?: string;
  /** Left aligned icon on the combo box. */
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
   * shows only while the list is open. A string is styled as caption text.
   */
  footer?: ReactNode;
  /**
   * Maximum number of options to show before the list scrolls.
   * @default 5
   */
  maxItemsUntilScroll?: number;
};

/**
 * The `<ComboBox />` component is a text input with a list of suggestions
 * under it.
 *
 * @remarks
 * Typing filters `defaultItems`. For suggestions fetched as the user types,
 * control the input with `inputValue` and `onInputChange`, pass the results as
 * `items`, and set `isLoading` while a request is in flight. With
 * `allowsCustomValue`, text that doesn't match an option is kept as the value.
 *
 * @example
 * _Filtering a list:_
 * ```tsx
 * import { ComboBox } from "@easypost/easy-ui/ComboBox";
 *
 * export function Component() {
 *  return (
 *    <ComboBox label="Fruit" defaultItems={fruits} helperText="Helper text">
 *      {(item) => <ComboBox.Option id={item.id}>{item.name}</ComboBox.Option>}
 *    </ComboBox>
 *  );
 * }
 * ```
 *
 * @example
 * _Fetched suggestions with free text:_
 * ```tsx
 * import { ComboBox } from "@easypost/easy-ui/ComboBox";
 *
 * export function Component() {
 *  const [street, setStreet] = React.useState("");
 *  const { predictions, isLoading } = usePredictions(street);
 *
 *  return (
 *    <ComboBox
 *      label="Street address"
 *      allowsCustomValue
 *      inputValue={street}
 *      onInputChange={setStreet}
 *      items={predictions}
 *      isLoading={isLoading}
 *      onSelectionChange={(key) => key && selectPrediction(key)}
 *      footer="Powered by Google"
 *    >
 *      {(item) => (
 *        <ComboBox.Option id={item.place_id}>{item.description}</ComboBox.Option>
 *      )}
 *    </ComboBox>
 *  );
 * }
 * ```
 */
export function ComboBox<T extends object>(props: ComboBoxProps<T>) {
  const {
    children,
    "aria-label": ariaLabel,
    isDisabled = false,
    isRequired = false,
    validationState = "valid",
    isLabelEmphasized = false,
    size = "md",
    label,
    errorText,
    helperText,
    placeholder,
    iconAtStart,
    isLoading = false,
    footer,
    maxItemsUntilScroll = DEFAULT_MAX_ITEMS_UNTIL_SCROLL,
    menuTrigger = "input",
    onOpenChange,
    ...comboBoxProps
  } = props;

  const listRef = useRef<HTMLDivElement | null>(null);
  // Set when the user types, cleared whenever the list opens or closes. Lets
  // suggestions that arrive after typing open the list without reopening it
  // after a selection or Escape.
  const hasTypedRef = useRef(false);

  logWarningForMissingAriaLabel(
    label,
    ariaLabel ?? comboBoxProps["aria-labelledby"],
  );

  // Only fetched (controlled) items arrive on their own; React Aria handles
  // `defaultItems`, which it filters as the input changes.
  const { items } = comboBoxProps;
  const hasItems = items !== undefined && Array.from(items).length > 0;

  const hasError = validationState === "invalid";
  const showErrorText = hasError && errorText;
  const showHelperText = !showErrorText && helperText;

  const popoverStyle = {
    ...getComponentToken("menu", "item_height", `${pxToRem(ITEM_HEIGHT)}rem`),
    ...getComponentToken(
      "menu",
      "padding.y",
      `${pxToRem(Y_PADDING_INSIDE_OVERLAY)}rem`,
    ),
    // React Aria measures the field into `--trigger-width`.
    ...getResponsiveValue("menu", "width", "var(--trigger-width)"),
  } as React.CSSProperties;

  return (
    <AriaComboBox
      {...comboBoxProps}
      aria-label={ariaLabel}
      className={styles.root}
      isDisabled={isDisabled}
      isRequired={isRequired}
      isInvalid={hasError}
      validationBehavior="aria"
      menuTrigger={menuTrigger}
      onOpenChange={(isOpen, trigger) => {
        hasTypedRef.current = false;
        onOpenChange?.(isOpen, trigger);
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
            hasError && styles.inputError,
            iconAtStart && styles.inputIconStart,
            isLoading && styles.inputIconEnd,
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
      {showErrorText ? (
        <ComboBoxCaption slot="errorMessage" variant="error">
          {errorText}
        </ComboBoxCaption>
      ) : showHelperText ? (
        <ComboBoxCaption slot="description" variant="helper">
          {helperText}
        </ComboBoxCaption>
      ) : null}
      <Popover
        className={styles.popover}
        style={popoverStyle}
        offset={OVERLAY_OFFSET}
        containerPadding={OVERLAY_PADDING_FROM_CONTAINER}
      >
        <ScrollContainer
          scrollRef={listRef}
          maxItemsUntilScroll={maxItemsUntilScroll}
        >
          <ListBox className={styles.listbox}>{children}</ListBox>
        </ScrollContainer>
        {footer && (
          <div
            className={styles.footer}
            // Keep focus in the input so pressing the footer doesn't close the list.
            onMouseDown={(e) => e.preventDefault()}
          >
            {typeof footer === "string" ? (
              <Text variant="caption" color="neutral.600">
                {footer}
              </Text>
            ) : (
              footer
            )}
          </div>
        )}
      </Popover>
    </AriaComboBox>
  );
}

/**
 * `InputCaption`, wired to the combo box through React Aria's `description`
 * and `errorMessage` slots.
 */
function ComboBoxCaption({
  slot,
  variant,
  children,
}: {
  slot: "description" | "errorMessage";
  variant: "helper" | "error";
  children: ReactNode;
}) {
  const { id } = useSlottedContext(TextContext, slot) ?? {};
  return (
    <InputCaption variant={variant} {...{ id }}>
      {children}
    </InputCaption>
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
  hasTypedRef: MutableRefObject<boolean>;
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
  scrollRef: MutableRefObject<HTMLDivElement | null>;
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

export type ComboBoxOptionProps = {
  /**
   * The option's unique key. Required when options are rendered from `items`
   * or `defaultItems` that don't have an `id` of their own.
   */
  id?: Key;
  /** An accessibility label for the option. */
  "aria-label"?: string;
  /** Rendered contents of the option. */
  children: ReactNode;
  /** Secondary text shown under the main option text. */
  description?: ReactNode;
  /**
   * Plain text value of the option: the text the input takes when it's
   * selected, and what typing filters on. Defaults to `children` when it's a
   * string.
   */
  textValue?: string;
  /**
   * Whether the option is disabled.
   * @default false
   */
  isDisabled?: boolean;
};

function ComboBoxOption(props: ComboBoxOptionProps) {
  const { children, description, textValue, ...optionProps } = props;
  return (
    <ListBoxItem
      {...optionProps}
      textValue={
        textValue ?? (typeof children === "string" ? children : undefined)
      }
      className={styles.option}
    >
      <div className={styles.optionContent}>
        <Text variant={description ? "body2" : "body1"} truncate>
          {children}
        </Text>
        {description && (
          <span className={styles.optionDescription}>
            <Text variant="caption" color="neutral.600" truncate>
              {description}
            </Text>
          </span>
        )}
      </div>
    </ListBoxItem>
  );
}

export type ComboBoxSectionProps = {
  /** The section's `<ComboBox.Option />`s. */
  children: ReactNode;
  /** An accessibility label for the section. */
  "aria-label"?: string;
};

function ComboBoxSection(props: ComboBoxSectionProps) {
  return <ListBoxSection {...props} className={styles.section} />;
}

/**
 * Represents an option in a `<ComboBox />`.
 *
 * @remarks
 * Should be rendered as a child of `<ComboBox />` or `<ComboBox.Section />`
 * as `<ComboBox.Option />`.
 */
ComboBox.Option = ComboBoxOption;

/**
 * Represents a section in a `<ComboBox />`.
 *
 * @remarks
 * Should be used as a wrapper for `<ComboBox.Option />`s. Sections are
 * divided by a separator.
 */
ComboBox.Section = ComboBoxSection;
