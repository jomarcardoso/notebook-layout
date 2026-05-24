'use client';
import { type ReactNode, type FC, type HTMLAttributes, useState } from 'react';

import './carousel.scss';

export interface CarouselProps extends HTMLAttributes<HTMLDivElement> {
  items: ReactNode[];
  initialIndex?: number;
}

export const Carousel: FC<CarouselProps> = ({
  items,
  initialIndex = 0,
  className = '',
  ...props
}) => {
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  if (!items.length) {
    return null;
  }

  const activeItem = items[activeIndex];

  return (
    <div className={`carousel ${className}`} {...props}>
      <div className="carousel__banner">{activeItem}</div>

      <div
        className="carousel__thumbs"
        role="tablist"
        aria-label="Carousel items"
      >
        {items.map((item, index) => {
          const isActive = index === activeIndex;

          return (
            <button
              key={index}
              type="button"
              role="tab"
              className={`carousel__thumb ${isActive ? 'carousel__thumb--active' : ''}`}
              onClick={() => setActiveIndex(index)}
              aria-selected={isActive}
              aria-label={`Show item ${index + 1}`}
            >
              {item}
            </button>
          );
        })}
      </div>
    </div>
  );
};
