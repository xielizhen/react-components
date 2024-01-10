import React, { CSSProperties, ReactNode, useCallback, useEffect, useState } from 'react';
import { ArrowBigLeft, ArrowBigRight, CircleDot, Circle } from 'lucide-react';
import cn from 'classnames';
import { SliderProps } from './types';
import './index.scss';

export function Slider(props: SliderProps) {
  const {
    autoPlay = false,
    indicatorsPosition = 'bottom',
    showDots = true,
    loop = true,
    indicators = true,
    onChange,
    children,
    duration = 400
  } = props;
  const length = React.Children.count(children);
  const [currentIndex, setCurrentIndex] = useState(0);

  const onPrev = useCallback(() => {
    setCurrentIndex(index => {
      if (index === 0) return length - 1;
      return index - 1;
    });
  }, [length]);

  const onNext = useCallback(() => {
    setCurrentIndex(index => {
      if (index === length - 1) return 0;
      return index + 1;
    });
  }, [length]);

  useEffect(() => {
    onChange?.(currentIndex);
  }, [currentIndex, onChange]);

  useEffect(() => {
    if (!autoPlay) return;
    const autoPlayInterval = typeof autoPlay === 'boolean' ? 3000 : autoPlay;
    const interval = setInterval(() => {
      onNext();
    }, autoPlayInterval);

    return () => {
      interval && clearInterval(interval);
    };
  }, [autoPlay, onNext]);

  return (
    <section className="slider" aria-label="slider">
      {/* slider content */}
      <div className="slider-content" style={{}}>
        {React.Children.map(children, (child: ReactNode, index) => {
          if (!React.isValidElement(child)) return null;
          return React.cloneElement(child as React.ReactElement, {
            key: child?.key || String(index),
            style: {
              ...(child?.props?.style || {}),
              translate: `${-100 * currentIndex}%`,
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
            onClick={onPrev}
            aria-label="view previous item"
          >
            <ArrowBigLeft />
          </button>
          <button className={cn('slider-dot', 'next')} onClick={onNext} aria-label="view next item">
            <ArrowBigRight />
          </button>
        </div>
      )}
      {/* indicators */}
      {indicators && (
        <div className={cn('slider-indicators', indicatorsPosition)}>
          {new Array(length).fill(0).map((_, index) => (
            <button className="slider-indicator" onClick={() => setCurrentIndex(index)} key={index}>
              {index === currentIndex ? <CircleDot aria-hidden /> : <Circle aria-hidden />}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
