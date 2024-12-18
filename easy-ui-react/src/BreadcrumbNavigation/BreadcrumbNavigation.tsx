import React, { useMemo, ReactNode } from "react";
import ArrowBackIcon from "@easypost/easy-ui-icons/ArrowBack";
import { Text } from "../Text";
import { Icon } from "../Icon";
import { HorizontalStack } from "../HorizontalStack";
import { UnstyledButton, UnstyledButtonProps } from "../UnstyledButton";
import { flattenChildren } from "../utilities/react";

import styles from "./BreadcrumbNavigation.module.scss";

export type BreadcrumbsNavigationProps = {
  children?: ReactNode;
};

export function BreadcrumbsNavigation(props: BreadcrumbsNavigationProps) {
  const { children } = props;

  const { backButton, breadcrumbs } = useMemo(() => {
    const breadcrumbNavigationChildren = flattenChildren(children);
    const backButton =
      breadcrumbNavigationChildren.length > 0
        ? breadcrumbNavigationChildren[0]
        : null;

    if (!backButton) {
      throw new Error("BreadcrumbNavigation must contain BackButton");
    }

    const breadcrumbs =
      breadcrumbNavigationChildren.length > 1
        ? breadcrumbNavigationChildren[1]
        : null;

    if (!breadcrumbs) {
      throw new Error("BreadcrumbNavigation must contain Breadcrumbs");
    }

    return {
      backButton,
      breadcrumbs,
    };
  }, [children]);

  return (
    <div className={styles.breadcrumbNavigationContainer}>
      <div className={styles.backButtonContainer}>{backButton}</div>
      <div className={styles.breadcrumbContainer}>{breadcrumbs}</div>
    </div>
  );
}

export function BackButton(props: UnstyledButtonProps) {
  const { children, ...restButtonProps } = props;

  return (
    <UnstyledButton {...restButtonProps} className={styles.backButton}>
      <Icon symbol={ArrowBackIcon} size="sm" />
      <Text variant="subtitle1">{children}</Text>
    </UnstyledButton>
  );
}

export type BreadcrumbsProps = {
  children?: ReactNode;
};

export function Breadcrumbs(props: BreadcrumbsProps) {
  const { children } = props;

  const breadcrumbs = useMemo(() => flattenChildren(children), [children]);

  return (
    <HorizontalStack blockAlign="center" gap="0.5">
      {breadcrumbs.map((breadcrumb, idx) => {
        if (idx === 0) {
          return <>{breadcrumb}</>;
        } else {
          return (
            <>
              <Breadcrumb>{">"}</Breadcrumb>
              {breadcrumb}
            </>
          );
        }
      })}
    </HorizontalStack>
  );
}

export type BreadcrumbProps = {
  children?: ReactNode;
};

export function Breadcrumb(props: BreadcrumbProps) {
  const { children } = props;

  return (
    <Text variant="body1" color="neutral.700">
      {children}
    </Text>
  );
}
