// notebook-layout/components/atoms/waiting.tsx
import { type ComponentProps, type CSSProperties, type FC } from 'react';
import { generateClasses } from '../../utils/utils';

export interface SkeletonTextProps extends ComponentProps<'span'> {
  lines?: number;
}

export const SkeletonText: FC<SkeletonTextProps> = ({
  lines = 3,
  className = '',
  ...props
}) => (
  <span {...props} aria-hidden="true" className={className || undefined}>
    {Array.from({ length: lines }, (_, index) => (
      <span
        key={index}
        className="skeleton skeleton-line"
        // The last line of a block is shorter, like a real paragraph.
        style={
          index === lines - 1 && lines > 1
            ? ({ '--skeleton-width': '60%' } as CSSProperties)
            : undefined
        }
      />
    ))}
  </span>
);

export interface WaitingProps extends ComponentProps<'div'> {
  label?: string;
}

/**
 * WAITING WITH NO KNOWN SHAPE, in a region.
 */
export const Waiting: FC<WaitingProps> = ({
  label = 'Carregando',
  className = '',
  ...props
}) => (
  <div
    {...props}
    className={generateClasses({
      'spinner-region': true,
      [className]: Boolean(className),
    })}
  >
    <span className="spinner-border" role="status">
      <span className="visually-hidden">{label}</span>
    </span>
  </div>
);

export interface ProgressMeterProps extends ComponentProps<'div'> {
  label: string;
  valueText: string;
  accessibleLabel: string;
  value: number;
  max: number;
}

export const ProgressMeter: FC<ProgressMeterProps> = ({
  label,
  valueText,
  accessibleLabel,
  value,
  max,
  ...props
}) => (
  <div {...props}>
    <div className="progress-meta">
      <span>{label}</span>
      <span className="numeric">{valueText}</span>
    </div>
    <div
      className="progress"
      role="progressbar"
      aria-label={accessibleLabel}
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <div
        className="progress-bar"
        style={{ width: `${(value / max) * 100}%` }}
      />
    </div>
  </div>
);

export interface ProgressProps extends ComponentProps<'div'> {
  label: string;
  value: number;
}

/**
 * A RULE THAT FILLS WITH INK.
 */
export const Progress: FC<ProgressProps> = ({ label, value, ...props }) => {
  const rounded = Math.round(value);

  return (
    <ProgressMeter
      {...props}
      label={label}
      valueText={`${rounded}%`}
      accessibleLabel={label}
      value={rounded}
      max={100}
    />
  );
};
