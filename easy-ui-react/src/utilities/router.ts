import { handleLinkClick, useLinkProps, useRouter } from "@react-aria/utils";
import { LinkDOMProps } from "@react-types/shared";
import { MouseEvent } from "react";

/**
 * Link props that Easy UI components forward to their underlying anchor
 * element, minus `href`, `target`, and `rel`, which most of our components
 * already declare through React Aria's button types.
 */
export type RouterLinkProps = Pick<
  LinkDOMProps,
  "download" | "hrefLang" | "ping" | "referrerPolicy" | "routerOptions"
>;

/**
 * Connects an anchor element to the client-side router supplied through
 * `<Provider navigate={...} useHref={...} />`.
 *
 * @remarks
 * React Aria's `useButton()` renders `href` as a plain attribute and knows
 * nothing about the router context, and several of our components build their
 * anchors by hand, so both perform a full page load even when a `navigate`
 * function is available. This hook supplies the missing pieces: an `href`
 * resolved through the provider's `useHref` and an `onClick` handler that hands
 * the navigation off to `navigate`.
 *
 * When no `navigate` function is provided, React Aria's router context reports
 * itself as native and `handleLinkClick` becomes a noop, leaving the anchor to
 * behave exactly as it did before. This makes the hook safe to add to existing
 * components without changing their default behavior.
 *
 * Pass `isEnabled: false` for polymorphic components rendering something other
 * than a native anchor. A custom element such as `next/link` is expected to
 * handle client-side navigation itself.
 *
 * @param props link props from the consuming component
 * @param isEnabled whether the underlying element is a native anchor
 * @returns DOM props to merge onto an anchor element
 *
 * @example
 * ```tsx
 * const routerLinkProps = useRouterLinkProps(props);
 * return <a {...mergeProps(elementProps, routerLinkProps)} />;
 * ```
 */
export function useRouterLinkProps(props: LinkDOMProps, isEnabled = true) {
  const router = useRouter();
  // hrefs are left alone when disabled; a polymorphic component can be handed
  // an href only its own link component understands, such as the URL objects
  // next/link accepts
  const linkProps = useLinkProps(isEnabled ? props : {});
  if (!isEnabled || !props.href) {
    return {};
  }
  return {
    ...linkProps,
    onClick(e: MouseEvent) {
      handleLinkClick(e, router, props.href, props.routerOptions);
    },
  };
}
