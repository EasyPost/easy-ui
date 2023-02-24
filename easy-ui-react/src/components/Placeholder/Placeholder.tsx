import React, { ReactNode } from "react";
import { classNames, variationName } from "../../utilities/css";

import DocumentScannerIcon from "@easypost/easy-ui-icons/DocumentScanner";
import CheckCircleIcon from "@easypost/easy-ui-icons/CheckCircle";
import WarningIcon from "@easypost/easy-ui-icons/Warning";
import ErrorIcon from "@easypost/easy-ui-icons/Error";

import styles from "./Placeholder.module.scss";

export type PlaceholderStatus = "info" | "success" | "warning" | "critical";

export interface PlaceholderProps {
  /** Message content for the Placeholder. */
  message: ReactNode;
  /** Sets the status of the Placeholder. */
  status?: PlaceholderStatus;
}

export function Placeholder({ message, status = "info" }: PlaceholderProps) {
  const IconSymbol = usePlaceholderIconSymbol(status);
  return (
    <div
      className={classNames(
        styles.Placeholder,
        styles[variationName("status", status)],
      )}
    >
      <div>
        <span className={styles.PlaceholderIcon}>
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
