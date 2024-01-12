import { MutableRefObject } from 'react';

export type BasicTarget<T = HTMLElement> =
  | (() => T | null)
  | T
  | null
  | MutableRefObject<T | null | undefined>;

export type TargetElement = HTMLElement | Element | Document | Window;
export type Target = BasicTarget<TargetElement>;

export function getTargetElement(
  target: BasicTarget<TargetElement>,
  defaultElement?: TargetElement
) {
  if (!target) {
    return defaultElement;
  }
  let targetElement: TargetElement | undefined | null;

  if (typeof target === 'function') {
    targetElement = target();
  } else if ('current' in target) {
    targetElement = target.current;
  } else {
    targetElement = target;
  }

  return targetElement;
}
