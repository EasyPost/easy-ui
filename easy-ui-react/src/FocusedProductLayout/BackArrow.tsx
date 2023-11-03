import ArrowBackIcon from "@easypost/easy-ui-icons/ArrowBack";
import React from "react";
import { Icon } from "../Icon";
import { Text } from "../Text";
import type { HeaderProps } from "./FocusedProductLayout";

import styles from "./BackArrow.module.scss";

export function BackArrow(props: Pick<HeaderProps, "renderBackArrow">) {
  const { renderBackArrow } = props;
  return (
    <span className={styles.BackArrow}>
      {renderBackArrow({
        children: (
          <>
            <Icon symbol={ArrowBackIcon} />
            <Text visuallyHidden>Back</Text>
          </>
        ),
      })}
    </span>
  );
}
