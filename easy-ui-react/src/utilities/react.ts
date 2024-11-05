import {
  Children,
  Key,
  NamedExoticComponent,
  ReactElement,
  ReactNode,
  cloneElement,
  isValidElement,
} from "react";
import { isFragment, isElement } from "react-is";

/**
 * Similar to React's built-in Children.toArray method, this utility takes
 * children and returns them as an array for introspection or filtering.
 * Different from Children.toArray, it will flatten arrays and React.Fragments
 * into a regular, one-dimensional array while ensuring element and fragment
 * keys are preserved, unique, and stable between renders.
 *
 * Adopted from https://github.com/grrowl/react-keyed-flatten-children
 *
 * @returns flattened children
 */
export function flattenChildren(
  children: ReactNode,
  depth: number = 0,
  keys: (string | number)[] = [],
): ReactNode[] {
  return Children.toArray(children).reduce(
    (acc: ReactNode[], node, nodeIndex) => {
      if (isFragment(node)) {
        // eslint-disable-next-line prefer-spread
        acc.push.apply(
          acc,
          flattenChildren(
            node.props.children,
            depth + 1,
            keys.concat(node.key || nodeIndex),
          ),
        );
      } else {
        if (isValidElement(node)) {
          acc.push(
            cloneElement(node, {
              key: keys.concat(String(node.key)).join("."),
            }),
          );
        } else if (typeof node === "string" || typeof node === "number") {
          acc.push(node);
        }
      }
      return acc;
    },
    [],
  );
}

export function filterChildrenByDisplayName(
  children: ReactNode,
  displayName: string,
) {
  const elements = flattenChildren(children).filter((n) =>
    isElement(n),
  ) as ReactElement[];
  return elements.filter((e) => {
    const elementType = e.type as NamedExoticComponent;
    return elementType.displayName === displayName;
  });
}

export function getDisplayNameFromReactNode(component: ReactNode) {
  const componentAsElement = component as ReactElement;
  if (isValidElement(componentAsElement)) {
    const componentType = componentAsElement.type as NamedExoticComponent;

    return componentType.displayName;
  }
}

/**
 * When Children.toArray is called, keys of the child are modified
 * in a predictable way. This function returns the original key
 * of the child.
 */
export function getFlattenedKey(
  key: Key | null,
  level: number = 2,
  defaultKey: string | Key = "",
): string | Key {
  if (key) {
    const keyAsString = key.toString();
    if (keyAsString) {
      const originalKey = keyAsString.substring(level);
      return originalKey;
    }
  }
  return defaultKey;
}

function hasChildren(
  element: ReactNode,
): element is ReactElement<{ children: ReactNode | ReactNode[] }> {
  return (
    isValidElement<{ children?: ReactNode[] }>(element) &&
    Boolean(element.props.children)
  );
}

function hasComplexChildren(
  element: ReactNode,
): element is ReactElement<{ children: ReactNode | ReactNode[] }> {
  return (
    isValidElement(element) &&
    hasChildren(element) &&
    Children.toArray(element.props.children).reduce(
      (response: boolean, child: ReactNode): boolean =>
        response || isValidElement(child),
      false,
    )
  );
}

/**
 * Recursively searches a React tree finding the first that meets the specified
 * comparator function.
 *
 * @param children Tree of children to search
 * @param deepFindFn Comparator function to test each child against
 * @returns The first child that meets the criteria of the comparator function
 */
export function deepFind(
  children: ReactNode | ReactNode[],
  deepFindFn: (
    child: ReactNode,
    index?: number,
    children?: ReactNode[],
  ) => boolean,
): ReactNode | undefined {
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let found;

  Children.toArray(children).find(
    (child: ReactNode, index: number, findChildren: ReactNode[]) => {
      if (deepFindFn(child, index, findChildren)) {
        found = child;
        return true;
      }

      if (isValidElement(child) && hasComplexChildren(child)) {
        // Find inside the child that has children
        found = deepFind(child.props.children, deepFindFn);
        return typeof found !== "undefined";
      }

      return false;
    },
  );

  return found;
}
