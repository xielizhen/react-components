import { TouchEvent, useCallback, useRef } from 'react';

export function useTouch() {
  const startX = useRef(0);
  const startY = useRef(0);
  const deltaX = useRef(0);
  const deltaY = useRef(0);
  const offsetX = useRef(0);
  const offsetY = useRef(0);
  const direction = useRef<Direction>('');
  const firstMove = useRef<boolean | null>(null);

  const isVertical = () => direction.current === 'vertical';
  const isHorizontal = () => direction.current === 'horizontal';

  const reset = useCallback(() => {
    deltaX.current = 0;
    deltaY.current = 0;
    offsetX.current = 0;
    offsetY.current = 0;
    direction.current = '';
    firstMove.current = null;
  }, []);

  const start = useCallback(
    (event: TouchEvent) => {
      reset();
      startX.current = event.touches[0].clientX;
      startY.current = event.touches[0].clientY;
    },
    [reset]
  );

  const move = useCallback((event: TouchEvent) => {
    const touch = event.touches[0];
    // Fix: safari back will set clientX to negative number
    deltaX.current = (touch.clientX < 0 ? 0 : touch.clientX) - startX.current;
    deltaY.current = touch.clientY - startY.current;
    offsetX.current = Math.abs(deltaX.current);
    offsetY.current = Math.abs(deltaY.current);

    if (firstMove.current === null) {
      firstMove.current = true;
    } else {
      firstMove.current = false;
    }

    if (!direction.current) {
      direction.current = getDirection(offsetX.current, offsetY.current);
    }
  }, []);

  return {
    move,
    start,
    reset,
    startX,
    startY,
    deltaX,
    deltaY,
    offsetX,
    offsetY,
    direction,
    firstMove,
    isVertical,
    isHorizontal
  };
}

export type Direction = '' | 'vertical' | 'horizontal';

export const MIN_DISTANCE = 10;

export function getDirection(x: number, y: number) {
  if (x > y && x > MIN_DISTANCE) {
    return 'horizontal';
  }
  if (y > x && y > MIN_DISTANCE) {
    return 'vertical';
  }
  return '';
}
