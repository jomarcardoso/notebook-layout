// notebook-layout/components/progress-indicator.tsx
import { type ComponentProps, type FC } from 'react';
import '../styles/components/progress-indicator.scss';
import { generateClasses } from '../utils/utils';
import { ProgressMeter } from './atoms/waiting';

export interface ProgressIndicatorProps extends ComponentProps<'div'> {
  current: number;
  total: number;
}

export const ProgressIndicator: FC<ProgressIndicatorProps> = ({
  current,
  total,
  className = '',
  ...props
}) => {
  const safeTotal = Math.max(total, 1);
  const clampedValue = Math.min(Math.max(current, 0), safeTotal);

  return (
    <ProgressMeter
      {...props}
      className={generateClasses({
        'progress-indicator': true,
        [className]: Boolean(className),
      })}
      label="Etapa"
      valueText={`${clampedValue} de ${safeTotal}`}
      accessibleLabel={`Etapa ${clampedValue} de ${safeTotal}`}
      value={clampedValue}
      max={safeTotal}
    />
  );
};
