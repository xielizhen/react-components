import React, {
  CSSProperties,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  TouchEvent,
  forwardRef,
  useImperativeHandle
} from 'react';
import cn from 'classnames';
import { ArrowBigLeft, ArrowBigRight, CircleDot, Circle } from 'lucide-react';
import { useTouch } from '@hooks/useTouch';
import { doubleRaf } from '@utils/raf';
import { preventDefault } from '@utils/index';
import { SliderProps, SliderRef } from './types';
import './index.scss';

export const Slider = forwardRef<SliderRef, SliderProps>((props, ref) => {
  const {
    autoPlay = false,
    indicatorsPosition = 'bottom',
    showDots = true,
    touchable = false,
    indicators = true,
    onChange,
    children,
    duration = 400
  } = props;

  const [activeIndex, setActiveIndex] = useState(0);
  const touch = useTouch();
  const touchStartTimeRef = useRef<number | undefined>(undefined);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const swipingRef = useRef<boolean>(false);

  const count = useMemo(() => {
    return React.Children.count(children) || 0;
  }, [children]);

  const stopAutoplay = useCallback(() => {
    autoPlayTimerRef.current && clearInterval(autoPlayTimerRef.current);
  }, []);

  const swipeTo = useCallback(
    (index: number) => {
      touch.reset();
      stopAutoplay();
      doubleRaf(() => {
        let targetIndex: number;
        if (index <= -1) {
          targetIndex = count + index;
        } else if (index >= count) {
          targetIndex = index - count;
        } else {
          targetIndex = index;
        }
        console.log('xxx targetIndex', targetIndex);
        doubleRaf(() => {
          swipingRef.current = false;
          setActiveIndex(targetIndex);
        });
      });
    },
    [count, stopAutoplay, touch]
  );

  const swipePrev = useCallback(() => {
    if (swipingRef.current) return;

    touch.reset();
    doubleRaf(() => {
      swipingRef.current = false;
      stopAutoplay();
      setActiveIndex(index => {
        if (index === 0) return count - 1;
        return index - 1;
      });
    });
  }, [count, stopAutoplay, touch]);

  const swipeNext = useCallback(() => {
    if (swipingRef.current) return;

    touch.reset();

    doubleRaf(() => {
      swipingRef.current = false;
      stopAutoplay();
      setActiveIndex(index => {
        if (index === count - 1) return 0;
        return index + 1;
      });
    });
  }, [count, stopAutoplay, touch]);

  const startAutoplay = useCallback(() => {
    if (!autoPlay || count <= 1) return;
    const autoPlayInterval = typeof autoPlay === 'boolean' ? 3000 : autoPlay;
    autoPlayTimerRef.current && clearInterval(autoPlayTimerRef.current);
    autoPlayTimerRef.current = setInterval(() => {
      swipeNext();
    }, autoPlayInterval);
  }, [autoPlay, count, swipeNext]);

  const onTouchStart = useCallback(
    (event: TouchEvent) => {
      if (!touchable) return;
      touch.start(event);
      touchStartTimeRef.current = Date.now();

      stopAutoplay();
    },
    [touchable, touch, stopAutoplay]
  );

  const onTouchMove = useCallback(
    (event: TouchEvent) => {
      console.log('xxx touch move', event);
      if (!touchable || !swipingRef.current) return;

      touch.move(event);

      preventDefault(event, true);
    },
    [touch, touchable]
  );

  const onTouchEnd = useCallback((event: TouchEvent) => {}, []);

  useImperativeHandle(ref, () => {
    return {
      swipeTo,
      swipeNext,
      swipePrev,
      activeIndex
    };
  });

  useEffect(() => {
    onChange?.(activeIndex);
  }, [activeIndex, onChange]);

  useEffect(() => {
    startAutoplay();
    return () => {
      stopAutoplay();
    };
  }, [startAutoplay, stopAutoplay]);

  return (
    <section className="slider" aria-label="slider">
      {/* slider content */}
      <div
        className="slider-content"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
        onTouchMove={onTouchMove}
        onClick={event => {
          event.stopPropagation();
        }}
      >
        {React.Children.map(children, (child: ReactNode, index) => {
          if (!React.isValidElement(child)) return null;
          return React.cloneElement(child as React.ReactElement, {
            key: child?.key || String(index),
            style: {
              ...(child?.props?.style || {}),
              translate: `${-100 * activeIndex}%`,
              flexFlow: 0,
              flexShrink: 0,
              transitionDuration: `${duration}ms`
            } as CSSProperties
          });
        })}
      </div>
      {/* dots */}
      {showDots && (
        <div className="slider-dots">
          <button
            className={cn('slider-dot', 'prev')}
            onClick={swipePrev}
            aria-label="view previous item"
          >
            <ArrowBigLeft />
          </button>
          <button
            className={cn('slider-dot', 'next')}
            onClick={swipeNext}
            aria-label="view next item"
          >
            <ArrowBigRight />
          </button>
        </div>
      )}
      {/* indicators */}
      {indicators && (
        <div className={cn('slider-indicators', indicatorsPosition)}>
          {new Array(length).fill(0).map((_, index) => (
            <button className="slider-indicator" onClick={() => setActiveIndex(index)} key={index}>
              {index === activeIndex ? <CircleDot aria-hidden /> : <Circle aria-hidden />}
            </button>
          ))}
        </div>
      )}
    </section>
  );
});
