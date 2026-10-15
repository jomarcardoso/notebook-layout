// notebook-layout/components/atoms/placeholder-figure.tsx
import { type FC, useId } from 'react';

export interface PlaceholderFigureProps {
  src: string;
}

/**
 * The figure inked in the neutral: how dark each pixel is becomes how much
 * neutral it carries, so the drawing keeps its detail and loses its colour.
 */
export const PlaceholderFigure: FC<PlaceholderFigureProps> = ({ src }) => {
  const filterId = `placeholder-figure-${useId().replace(/[^\w-]/g, '')}`;

  return (
    <>
      <svg className="placeholder-figure__filter" aria-hidden="true">
        <filter id={filterId} colorInterpolationFilters="sRGB">
          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -0.2126 -0.7152 -0.0722 0 1"
            result="ink"
          />
          <feComposite in="ink" in2="SourceAlpha" operator="in" result="shape" />
          <feFlood className="placeholder-figure__ink" />
          <feComposite in2="shape" operator="in" />
        </filter>
      </svg>
      <img
        className="content-figure placeholder-figure"
        src={src}
        alt=""
        style={{ filter: `url(#${filterId})` }}
      />
    </>
  );
};
