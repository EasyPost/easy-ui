import React, { ReactNode } from "react";
import type { ResponsiveProp } from "../utilities/css";
import { TokenNamespace } from "../utilities/types";
import {
  classNames,
  getResponsiveToken,
  variationName,
} from "../utilities/css";

import CheckCircleIcon from "@easypost/easy-ui-icons/CheckCircle";
import DocumentScannerIcon from "@easypost/easy-ui-icons/DocumentScanner";
import ErrorIcon from "@easypost/easy-ui-icons/Error";
import WarningIcon from "@easypost/easy-ui-icons/Warning";

import styles from "./Placeholder.module.scss";

export type IconSize = TokenNamespace<"size-icon">;
export type PlaceholderStatus = "info" | "success" | "warning" | "critical";

export interface PlaceholderProps {
  /** Message content for the Placeholder. */
  message: ReactNode;
  /** Sets the status of the Placeholder. */
  status?: PlaceholderStatus;
  /** Size of the attached status icon. */
  iconSize?: ResponsiveProp<IconSize>;
}

export function Placeholder({
  message,
  status = "info",
  iconSize = "md",
}: PlaceholderProps) {
  const IconSymbol = usePlaceholderIconSymbol(status);
  const style = getResponsiveToken(
    "placeholder-icon",
    "size",
    "size-icon",
    iconSize,
  );
  return (
    <div
      className={classNames(
        styles.Placeholder,
        styles[variationName("status", status)],
      )}
    >
      <div>
        <span className={styles.PlaceholderIcon} style={style}>
          <IconSymbol />
        </span>
      </div>
      <div className={styles.PlaceholderMessage}>{message}</div>
    </div>
  );
}

function usePlaceholderIconSymbol(status: PlaceholderStatus) {
  switch (status) {
    case "success": {
      return CheckCircleIcon;
    }
    case "warning": {
      return WarningIcon;
    }
    case "critical": {
      return ErrorIcon;
    }
    default: {
      return DocumentScannerIcon;
    }
  }
}
