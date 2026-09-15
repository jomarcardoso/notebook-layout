'use client';
import { type FC, useMemo } from 'react';
import '../styles/components/progress-indicator.scss';
import { generateClasses } from '../utils/utils';

export interface ProgressIndicatorProps {
  current: number;
  total: number;
  className?: string;
}

export const ProgressIndicator: FC<ProgressIndicatorProps> = ({
  current,
  total,
  className = '',
}) => {
  const safeTotal = Math.max(total, 1);
  const clampedValue = Math.min(Math.max(current, 0), safeTotal);
  const classes = useMemo(
    () =>
      generateClasses({
        'progress-indicator': true,
        [className]: !!className,
      }),
    [className],
  );

  return (
    <div className={classes}>
      <div className="progress-meta">
        <span>Etapa</span>
        <span className="numeric">
          {clampedValue} de {safeTotal}
        </span>
      </div>

      <div
        className="progress"
        role="progressbar"
        aria-label={`Etapa ${clampedValue} de ${safeTotal}`}
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={safeTotal}
      >
        <div
          className="progress-bar"
          style={{ width: `${(clampedValue / safeTotal) * 100}%` }}
        />
      </div>
    </div>
  );
};
