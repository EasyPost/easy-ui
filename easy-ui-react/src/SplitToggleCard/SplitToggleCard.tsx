import React, { ReactNode } from "react";
import { useToggleState } from "react-stately";
import { Card } from "../Card";
import { HorizontalGrid } from "../HorizontalGrid";
import { HorizontalStack } from "../HorizontalStack";
import { Text } from "../Text";
import { Toggle, ToggleProps } from "../Toggle";
import { VerticalStack } from "../VerticalStack";
import { classNames } from "../utilities/css";

import styles from "./SplitToggleCard.module.scss";

const SWITCH_PANEL_MIN_WIDTH = "80px";

export type SplitToggleCardStatusLabels = {
  /** Label shown under the switch when it's on. */
  on: ReactNode;
  /** Label shown under the switch when it's off. */
  off: ReactNode;
};

export type SplitToggleCardCardVariant = "outlined" | "solid";

export type SplitToggleCardProps = Omit<ToggleProps, "children"> & {
  /**
   * Content beside the switch. The content doesn't label the switch, so
   * point `aria-labelledby` at the content's title.
   */
  children: ReactNode;

  /**
   * Text under the switch that states its current state, such as
   * "Enrolled" and "Not enrolled". The switch panel sizes itself to the
   * longer label, so nothing moves when the state changes.
   */
  statusLabels?: SplitToggleCardStatusLabels;

  /**
   * Card surface. Use `solid` when the card sits inside another card; it
   * drops the border and uses quieter backgrounds. Separate from `variant`,
   * which sets the switch's color.
   *
   * @default outlined
   */
  cardVariant?: SplitToggleCardCardVariant;
};

/**
 * An interactive binary control with related content.
 *
 * @remarks
 * Use a SplitToggleCard when an "on/off" or "yes/no" input is
 * needed with related content.
 *
 * The children aren't the switch's label. Name the switch by pointing
 * `aria-labelledby` at the content's title.
 *
 * @example
 * ```tsx
 * <SplitToggleCard aria-labelledby={titleId}>
 *   <Text id={titleId}>Toggle Label</Text>
 * </SplitToggleCard>
 * ```
 *
 * @example
 * _Default value:_
 * ```tsx
 * <SplitToggleCard aria-labelledby={titleId} defaultSelected={true}>
 *   <Text id={titleId}>Toggle Label</Text>
 * </SplitToggleCard>
 * ```
 *
 * @example
 * _Controlled:_
 * ```tsx
 * <SplitToggleCard
 *   aria-labelledby={titleId}
 *   isSelected={isSelected}
 *   onChange={(isSelected) => setIsSelected(isSelected)}
 * >
 *   <Text id={titleId}>Toggle Label</Text>
 * </SplitToggleCard>
 * ```
 *
 * @example
 * _Status labels:_
 * ```tsx
 * <SplitToggleCard
 *   aria-labelledby={titleId}
 *   isSelected={isEnrolled}
 *   onChange={setIsEnrolled}
 *   statusLabels={{ on: "Enrolled", off: "Not enrolled" }}
 * >
 *   <Text id={titleId}>Shipping Insurance</Text>
 * </SplitToggleCard>
 * ```
 *
 * @example
 * _Solid, for use inside another card:_
 * ```tsx
 * <SplitToggleCard aria-labelledby={titleId} cardVariant="solid">
 *   <Text id={titleId}>Toggle Label</Text>
 * </SplitToggleCard>
 * ```
 *
 * @example
 * _Disabled:_
 * ```tsx
 * <SplitToggleCard aria-labelledby={titleId} isDisabled={true}>
 *   <Text id={titleId}>Toggle Label</Text>
 * </SplitToggleCard>
 * ```
 *
 * @example
 * _Read-only:_
 * ```tsx
 * <SplitToggleCard
 *   aria-labelledby={titleId}
 *   isSelected={true}
 *   isReadOnly={true}
 * >
 *   <Text id={titleId}>Toggle Label</Text>
 * </SplitToggleCard>
 * ```
 */
export const SplitToggleCard = (props: SplitToggleCardProps) => {
  const {
    children,
    statusLabels,
    cardVariant = "outlined",
    isSelected,
    defaultSelected,
    onChange,
    ...toggleProps
  } = props;

  // Owned here, not in Toggle, so the status label can follow the state
  // when the card is uncontrolled.
  const state = useToggleState({
    isSelected,
    defaultSelected,
    onChange,
    isReadOnly: toggleProps.isReadOnly,
  });

  const isSolid = cardVariant === "solid";

  const toggle = (
    <Toggle
      {...toggleProps}
      isSelected={state.isSelected}
      onChange={state.setSelected}
    />
  );

  return (
    <Card.Container variant={cardVariant}>
      <HorizontalGrid
        columns={[`minmax(${SWITCH_PANEL_MIN_WIDTH}, max-content)`, "1fr"]}
      >
        <Card.Area
          background={isSolid ? "neutral.050" : "secondary"}
          padding="3"
        >
          <HorizontalStack align="center">
            {statusLabels ? (
              <VerticalStack gap="1" inlineAlign="center">
                {toggle}
                {/* The switch already tells assistive tech its state. */}
                <span className={styles.statusLabels} aria-hidden="true">
                  <span
                    className={classNames(!state.isSelected && styles.hidden)}
                  >
                    <Text variant="caption" color="subdued">
                      {statusLabels.on}
                    </Text>
                  </span>
                  <span
                    className={classNames(state.isSelected && styles.hidden)}
                  >
                    <Text variant="caption" color="subdued">
                      {statusLabels.off}
                    </Text>
                  </span>
                </span>
              </VerticalStack>
            ) : (
              toggle
            )}
          </HorizontalStack>
        </Card.Area>
        <Card.Area background={isSolid ? "neutral.025" : "primary"} padding="2">
          {children}
        </Card.Area>
      </HorizontalGrid>
    </Card.Container>
  );
};
