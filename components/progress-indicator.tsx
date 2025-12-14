import { type FC, useMemo } from 'react';
import { Progressbar } from './progressbar';
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
      <div className="progress-indicator__header">
        etapa {clampedValue} / {safeTotal}
      </div>

      <Progressbar value={clampedValue} max={safeTotal} />
    </div>
  );
};
