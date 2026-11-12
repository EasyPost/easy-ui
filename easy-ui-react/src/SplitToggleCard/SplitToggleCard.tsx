import React, {
  ReactNode,
  isValidElement,
  useEffect,
  useId,
  useMemo,
  useState,
} from "react";
import { useToggleState } from "react-stately";
import { Card } from "../Card";
import { HorizontalGrid } from "../HorizontalGrid";
import { Text, TextProps } from "../Text";
import { Toggle, ToggleProps } from "../Toggle";
import { VerticalStack } from "../VerticalStack";
import { classNames } from "../utilities/css";
import { flattenChildren, useIsomorphicLayoutEffect } from "../utilities/react";
import {
  SplitToggleCardInternalContext,
  SplitToggleCardState,
  SplitToggleCardStateContext,
  SplitToggleCardVariant,
  useSplitToggleCardInternalContext,
  useSplitToggleCardState,
} from "./context";

import styles from "./SplitToggleCard.module.scss";

export {
  useSplitToggleCardState,
  type SplitToggleCardState,
  type SplitToggleCardVariant,
};

const SWITCH_PANEL_MIN_WIDTH = "80px";

type ToggleStateProps =
  "isSelected" | "defaultSelected" | "onChange" | "isDisabled" | "isReadOnly";

export type SplitToggleCardProps = Omit<ToggleProps, "children" | "variant"> & {
  /**
   * The card's parts: `<SplitToggleCard.ToggleContainer />` and
   * `<SplitToggleCard.ContentContainer />`.
   *
   * As a shorthand, pass content alone and the card puts it beside a
   * switch. The content doesn't label the switch, so point
   * `aria-labelledby` at its title.
   */
  children: ReactNode;

  /**
   * Card surface. Use `solid` when the card sits inside another card; it
   * drops the border and uses quieter backgrounds. Set the switch's color
   * on `<SplitToggleCard.Toggle variant />`.
   *
   * @default outlined
   */
  variant?: SplitToggleCardVariant;
};

export type SplitToggleCardToggleContainerProps = {
  /** Usually `<SplitToggleCard.Toggle />` and `<SplitToggleCard.Status />`. */
  children: ReactNode;
};

export type SplitToggleCardToggleProps = Omit<
  ToggleProps,
  "children" | ToggleStateProps
>;

export type SplitToggleCardStatusProps = {
  /** Shown when the switch is on. Ignored if `children` is set. */
  on?: ReactNode;

  /** Shown when the switch is off. Ignored if `children` is set. */
  off?: ReactNode;

  /**
   * A custom status. It's rendered once for each state so the panel can
   * size itself to the wider one, so keep it free of side effects. Read
   * the state it draws with `useSplitToggleCardState()`.
   */
  children?: ReactNode;

  /**
   * Make the status the switch's description. Leave it off when the status
   * only repeats on and off, which the switch already announces.
   *
   * @default false
   */
  describesToggle?: boolean;
};

export type SplitToggleCardContentContainerProps = {
  /** Content beside the switch, usually led by `<SplitToggleCard.Title />`. */
  children: ReactNode;
};

export type SplitToggleCardTitleProps = Omit<TextProps, "id">;

/**
 * An interactive binary control with related content.
 *
 * @remarks
 * Use a SplitToggleCard when an "on/off" or "yes/no" input is
 * needed with related content.
 *
 * It's a compound component. Each part reads the card's state from
 * context, so any part can be replaced with your own, built with
 * `useSplitToggleCardState()`.
 *
 * - `<SplitToggleCard.ToggleContainer />` is the switch panel.
 * - `<SplitToggleCard.Toggle />` is the switch.
 * - `<SplitToggleCard.Status />` states the current state under the switch.
 * - `<SplitToggleCard.ContentContainer />` holds the content.
 * - `<SplitToggleCard.Title />` titles the content and names the switch.
 *
 * The switch's state goes on the root.
 *
 * @example
 * ```tsx
 * <SplitToggleCard isSelected={isEnrolled} onChange={setIsEnrolled}>
 *   <SplitToggleCard.ToggleContainer>
 *     <SplitToggleCard.Toggle />
 *     <SplitToggleCard.Status on="Enrolled" off="Not enrolled" />
 *   </SplitToggleCard.ToggleContainer>
 *   <SplitToggleCard.ContentContainer>
 *     <SplitToggleCard.Title>Shipping Insurance</SplitToggleCard.Title>
 *     <Text variant="body2">Insure every eligible shipment.</Text>
 *   </SplitToggleCard.ContentContainer>
 * </SplitToggleCard>
 * ```
 *
 * @example
 * _Solid, for use inside another card:_
 * ```tsx
 * <SplitToggleCard variant="solid">
 *   <SplitToggleCard.ToggleContainer>
 *     <SplitToggleCard.Toggle />
 *   </SplitToggleCard.ToggleContainer>
 *   <SplitToggleCard.ContentContainer>
 *     <SplitToggleCard.Title>Toggle Label</SplitToggleCard.Title>
 *   </SplitToggleCard.ContentContainer>
 * </SplitToggleCard>
 * ```
 *
 * @example
 * _Custom status:_
 * ```tsx
 * function EnrollmentStatus() {
 *   const { isSelected } = useSplitToggleCardState();
 *   return <Badge>{isSelected ? "Enrolled" : "Not enrolled"}</Badge>;
 * }
 *
 * <SplitToggleCard.Status>
 *   <EnrollmentStatus />
 * </SplitToggleCard.Status>
 * ```
 *
 * @example
 * _Shorthand, with content only:_
 * ```tsx
 * <SplitToggleCard aria-labelledby={titleId} defaultSelected={true}>
 *   <Text id={titleId}>Toggle Label</Text>
 * </SplitToggleCard>
 * ```
 */
export function SplitToggleCard(props: SplitToggleCardProps) {
  const {
    children,
    variant = "outlined",
    isSelected,
    defaultSelected,
    onChange,
    isDisabled = false,
    isReadOnly = false,
    ...toggleProps
  } = props;

  const toggleState = useToggleState({
    isSelected,
    defaultSelected,
    onChange,
    isReadOnly,
  });
  const titleId = useId();
  const [statusId, setStatusId] = useState<string | null>(null);

  const state: SplitToggleCardState = {
    isSelected: toggleState.isSelected,
    setSelected: toggleState.setSelected,
    toggle: toggleState.toggle,
    isDisabled,
    isReadOnly,
    variant,
    titleId,
  };

  const isComposed = flattenChildren(children).some(
    (child) =>
      isValidElement(child) &&
      (child.type === SplitToggleCardToggleContainer ||
        child.type === SplitToggleCardContentContainer),
  );

  return (
    <SplitToggleCardInternalContext.Provider
      value={{ toggleProps, statusId, setStatusId }}
    >
      <SplitToggleCardStateContext.Provider value={state}>
        <Card.Container variant={variant}>
          <HorizontalGrid
            columns={[`minmax(${SWITCH_PANEL_MIN_WIDTH}, max-content)`, "1fr"]}
          >
            {isComposed ? (
              children
            ) : (
              <>
                <SplitToggleCardToggleContainer>
                  <SplitToggleCardToggle />
                </SplitToggleCardToggleContainer>
                <SplitToggleCardContentContainer>
                  {children}
                </SplitToggleCardContentContainer>
              </>
            )}
          </HorizontalGrid>
        </Card.Container>
      </SplitToggleCardStateContext.Provider>
    </SplitToggleCardInternalContext.Provider>
  );
}

function SplitToggleCardToggleContainer(
  props: SplitToggleCardToggleContainerProps,
) {
  const { children } = props;
  const { variant } = useSplitToggleCardState();
  return (
    <Card.Area
      background={variant === "solid" ? "neutral.050" : "secondary"}
      padding="3"
    >
      <VerticalStack gap="1" inlineAlign="center">
        {children}
      </VerticalStack>
    </Card.Area>
  );
}

function SplitToggleCardToggle(props: SplitToggleCardToggleProps) {
  const state = useSplitToggleCardState();
  const { toggleProps, statusId } = useSplitToggleCardInternalContext();
  const merged = { ...toggleProps, ...props } as SplitToggleCardToggleProps;
  const hasOwnName = Boolean(merged["aria-label"] || merged["aria-labelledby"]);
  const describedBy =
    [merged["aria-describedby"], statusId].filter(Boolean).join(" ") ||
    undefined;

  useEffect(() => {
    if (!hasOwnName && !document.getElementById(state.titleId)) {
      console.warn(
        "SplitToggleCard.Toggle has no name. Render a <SplitToggleCard.Title />, put `titleId` from useSplitToggleCardState() on your own title, or pass aria-labelledby.",
      );
    }
  }, [hasOwnName, state.titleId]);

  return (
    <Toggle
      {...merged}
      aria-labelledby={hasOwnName ? merged["aria-labelledby"] : state.titleId}
      aria-describedby={describedBy}
      isSelected={state.isSelected}
      onChange={state.setSelected}
      isDisabled={state.isDisabled}
      isReadOnly={state.isReadOnly}
    />
  );
}

function SplitToggleCardStatus(props: SplitToggleCardStatusProps) {
  const { on, off, children, describesToggle = false } = props;
  const state = useSplitToggleCardState();
  const { setStatusId } = useSplitToggleCardInternalContext();
  const id = useId();

  useIsomorphicLayoutEffect(() => {
    if (!describesToggle) {
      return;
    }
    setStatusId(id);
    return () => setStatusId(null);
  }, [describesToggle, id, setStatusId]);

  const onState = useMemo(() => ({ ...state, isSelected: true }), [state]);
  const offState = useMemo(() => ({ ...state, isSelected: false }), [state]);

  // Both copies share one grid cell, so the panel is as wide as the wider
  // copy and nothing moves when the state changes.
  return (
    <span
      className={styles.status}
      aria-hidden={describesToggle ? undefined : true}
    >
      {[onState, offState].map((copyState) => {
        const isVisible = copyState.isSelected === state.isSelected;
        return (
          <span
            key={String(copyState.isSelected)}
            id={isVisible ? id : undefined}
            className={classNames(
              styles.statusCopy,
              !isVisible && styles.hidden,
            )}
            data-state={copyState.isSelected ? "on" : "off"}
          >
            <SplitToggleCardStateContext.Provider value={copyState}>
              {children ?? (
                <Text variant="caption" color="subdued">
                  {copyState.isSelected ? on : off}
                </Text>
              )}
            </SplitToggleCardStateContext.Provider>
          </span>
        );
      })}
    </span>
  );
}

function SplitToggleCardContentContainer(
  props: SplitToggleCardContentContainerProps,
) {
  const { children } = props;
  const { variant } = useSplitToggleCardState();
  return (
    <Card.Area
      background={variant === "solid" ? "neutral.025" : "primary"}
      padding="2"
    >
      {children}
    </Card.Area>
  );
}

function SplitToggleCardTitle(props: SplitToggleCardTitleProps) {
  const { titleId } = useSplitToggleCardState();
  return (
    <Text variant="subtitle2" color="primary.800" {...props} id={titleId} />
  );
}

/** The switch panel of a `<SplitToggleCard />`. */
SplitToggleCard.ToggleContainer = SplitToggleCardToggleContainer;

/** The switch of a `<SplitToggleCard />`. Its state is set on the root. */
SplitToggleCard.Toggle = SplitToggleCardToggle;

/** The current state, shown under the switch of a `<SplitToggleCard />`. */
SplitToggleCard.Status = SplitToggleCardStatus;

/** The content area of a `<SplitToggleCard />`. */
SplitToggleCard.ContentContainer = SplitToggleCardContentContainer;

/** The title of a `<SplitToggleCard />`, which also names its switch. */
SplitToggleCard.Title = SplitToggleCardTitle;
