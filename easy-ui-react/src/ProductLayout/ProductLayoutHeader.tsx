import MenuIcon from "@easypost/easy-ui-icons/Menu";
import { CollectionChildren } from "@react-types/shared";
import React, { ReactNode } from "react";
import { Button, ButtonProps } from "../Button";
import { Icon } from "../Icon";
import { Text } from "../Text";
import { HelpMenu } from "./HelpMenu";
import { useProductLayout } from "./context";

import styles from "./ProductLayoutHeader.module.scss";

export type ProductLayoutHeaderProps = {
  helpMenuItems: CollectionChildren<object>;
  primaryAction?: ProductLayoutHeaderActionProps;
  renderLogo: () => ReactNode;
  secondaryAction?: ProductLayoutHeaderActionProps;
  title: ReactNode;
};

export type ProductLayoutHeaderActionProps = {
  content: string;
  onAction: () => void;
  isDisabled?: boolean;
};

export function ProductLayoutHeader(props: ProductLayoutHeaderProps) {
  return (
    <header>
      <MobileHeader {...props} />
      <DesktopHeader {...props} />
    </header>
  );
}

function MobileHeader(props: ProductLayoutHeaderProps) {
  const { renderLogo, title } = props;
  const { setIsMobileSidebarOpen } = useProductLayout();
  return (
    <div className={styles.ProductLayoutHeaderMobile}>
      <div className={styles.mobileTopBar}>
        <div className={styles.mobileLogoMenu}>
          <button
            className={styles.mobileLogoMenuBtn}
            onClick={() => {
              setIsMobileSidebarOpen(true);
            }}
          >
            <Icon symbol={MenuIcon} />
          </button>
          {renderLogo()}
        </div>
        <div className={styles.mobileActions}>
          <Actions buttonSize="sm" {...props} />
        </div>
      </div>
      <div className={styles.mobileTitle}>
        <Text as="h2" variant="heading4">
          {title}
        </Text>
      </div>
    </div>
  );
}

function DesktopHeader(props: ProductLayoutHeaderProps) {
  const { title } = props;
  return (
    <div className={styles.ProductLayoutHeaderDesktop}>
      <Text as="h2" variant="heading4">
        {title}
      </Text>
      <div className={styles.desktopActions}>
        <Actions {...props} />
      </div>
    </div>
  );
}

function Actions(
  props: { buttonSize?: ButtonProps["size"] } & ProductLayoutHeaderProps,
) {
  const {
    buttonSize = "md",
    helpMenuItems,
    primaryAction,
    secondaryAction,
  } = props;
  return (
    <>
      <HelpMenu items={helpMenuItems} />
      {(primaryAction || secondaryAction) && <Divider />}
      {secondaryAction && (
        <Button
          size={buttonSize}
          variant="outlined"
          onPress={secondaryAction.onAction}
          isDisabled={secondaryAction.isDisabled}
        >
          {secondaryAction.content}
        </Button>
      )}
      {primaryAction && (
        <Button
          size={buttonSize}
          onPress={primaryAction.onAction}
          isDisabled={primaryAction.isDisabled}
        >
          {primaryAction.content}
        </Button>
      )}
    </>
  );
}

function Divider() {
  return <div className={styles.divider} />;
}
