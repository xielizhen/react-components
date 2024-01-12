import { useCallback, useEffect, useRef } from 'react';
import { inBrowser } from '@utils/index';
import { getTargetElement, Target } from '@utils/dom/getTargetElement';
import { supportsPassive } from '@utils/supportsPassive';

export function useEventListener(
  type: string,
  listener: EventListener,
  options: UseEventListenerOptions
): void {
  const { target, passive = false, capture = false, depends = [] } = options;
  const attachedRef = useRef<boolean>(false);

  const add = useCallback(() => {
    const element = getTargetElement(target!);
    if (element && !attachedRef.current) {
      element.addEventListener(type, listener, supportsPassive ? { capture, passive } : capture);
      attachedRef.current = true;
    }
  }, [capture, listener, passive, target, type]);

  const remove = useCallback(() => {
    const element = getTargetElement(target!);
    if (element && attachedRef.current) {
      element.removeEventListener(type, listener, capture);
      attachedRef.current = false;
    }
  }, [capture, listener, target, type]);

  useEffect(() => {
    if (!inBrowser) {
      return;
    }
    add();
    return () => {
      remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [add, remove, ...depends]);
}

export type UseEventListenerOptions = {
  target?: Target;
  capture?: boolean;
  passive?: boolean;
  once?: boolean;
  depends?: Array<unknown>;
};
