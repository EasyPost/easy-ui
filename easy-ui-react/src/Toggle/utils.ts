import { ToggleProps } from "./Toggle";

export const getTextColorFromProps = ({
  variant,
  isDisabled,
  isSelected,
}: {
  variant: NonNullable<ToggleProps["variant"]>;
  isDisabled: boolean;
  isSelected: boolean;
}) => {
  switch (true) {
    case isDisabled:
      return "neutral.300";
    case variant === "success" && isSelected:
      return "positive.700";
    case variant === "danger" && isSelected:
      return "negative.700";
    case variant === "primary" && isSelected:
    default:
      return "primary.800";
  }
};
