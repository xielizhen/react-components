import { UIEvent } from 'react';
export const inBrowser = typeof window !== 'undefined';

export const clamp = (num: number, min: number, max: number): number =>
  Math.min(Math.max(num, min), max);

export function preventDefault(event: UIEvent, isStopPropagation?: boolean) {
  /* istanbul ignore else */
  if (typeof event.cancelable !== 'boolean' || event.cancelable) {
    event.preventDefault();
  }

  if (isStopPropagation) {
    event.stopPropagation();
  }
}
