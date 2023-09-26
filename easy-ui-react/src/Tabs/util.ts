export function getSharedMeasurementsForTabNavItem($item: HTMLElement) {
  const $nav = $item.closest('[data-ezui-tabs-indicator-parent="true"]');
  if (!$nav) {
    throw new Error("Unable to find parent nav element from tab item");
  }

  const itemRect = $item.getBoundingClientRect();
  const navRect = $nav.getBoundingClientRect();
  const navScrollLeft = $nav.scrollLeft;

  const itemWidth = itemRect.width;
  const itemPosition = navScrollLeft + (itemRect.x - navRect.x);

  return {
    $nav,
    itemRect,
    navRect,
    navScrollLeft,
    itemWidth,
    itemPosition,
  };
}
