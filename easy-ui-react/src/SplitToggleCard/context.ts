import { createContext, useContext } from "react";

export type SplitToggleCardVariant = "outlined" | "solid";

export type SplitToggleCardState = {
  /**
   * Whether the switch is on. Inside `<SplitToggleCard.Status />`, this is
   * the state that copy of the status draws, rather than the live state.
   */
  isSelected: boolean;

  /** Turns the switch on or off. */
  setSelected: (isSelected: boolean) => void;

  /** Flips the switch. */
  toggle: () => void;

  /** Whether the switch is disabled. */
  isDisabled: boolean;

  /** Whether the switch is read-only. */
  isReadOnly: boolean;

  /** The card's surface. */
  variant: SplitToggleCardVariant;

  /**
   * The id `<SplitToggleCard.Title />` renders and the switch is named by.
   * Put it on your own title element if you replace the title.
   */
  titleId: string;
};

export type SplitToggleCardInternalContextValue = {
  /** Toggle props given to the root, used as defaults by the toggle. */
  toggleProps: Record<string, unknown>;
  /** The id of the visible status copy, when it describes the switch. */
  statusId: string | null;
  setStatusId: (id: string | null) => void;
};

export const SplitToggleCardStateContext =
  createContext<SplitToggleCardState | null>(null);

export const SplitToggleCardInternalContext =
  createContext<SplitToggleCardInternalContextValue | null>(null);

/**
 * Returns the state of the nearest `<SplitToggleCard />`.
 *
 * @remarks
 * Use it to build your own parts, such as a custom status. Inside
 * `<SplitToggleCard.Status />`, `isSelected` is the state that copy of the
 * status draws, so the panel can size itself to both copies.
 */
export function useSplitToggleCardState() {
  const context = useContext(SplitToggleCardStateContext);
  if (!context) {
    throw new Error(
      "useSplitToggleCardState must be used within a SplitToggleCard component",
    );
  }
  return context;
}

export function useSplitToggleCardInternalContext() {
  const context = useContext(SplitToggleCardInternalContext);
  if (!context) {
    throw new Error(
      "SplitToggleCard parts must be used within a SplitToggleCard component",
    );
  }
  return context;
}
