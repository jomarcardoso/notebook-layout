// notebook-layout/components/atoms/waiting.tsx
import { type CSSProperties, type FC } from 'react';

export interface SkeletonTextProps {
  lines?: number;
  className?: string;
}

export const SkeletonText: FC<SkeletonTextProps> = ({
  lines = 3,
  className = '',
}) => (
  <span aria-hidden="true" className={className || undefined}>
    {Array.from({ length: lines }, (_, index) => (
      <span
        key={index}
        className="skeleton skeleton-line"
        // A ultima linha de um bloco e mais curta, como um paragrafo de verdade.
        style={
          index === lines - 1 && lines > 1
            ? ({ '--skeleton-width': '60%' } as CSSProperties)
            : undefined
        }
      />
    ))}
  </span>
);

/**
 * ESPERA SEM FORMA CONHECIDA, numa regiao.
 */
export const Waiting: FC<{ label?: string }> = ({ label = 'Carregando' }) => (
  <div className="spinner-region">
    <span className="spinner-border" role="status">
      <span className="visually-hidden">{label}</span>
    </span>
  </div>
);

export interface ProgressProps {
  label: string;
  value: number;
}

/**
 * UM FIO QUE SE ENCHE DE TINTA.
 */
export const Progress: FC<ProgressProps> = ({ label, value }) => {
  const rounded = Math.round(value);

  return (
    <div>
      <div className="progress-meta">
        <span>{label}</span>
        <span className="numeric">{rounded}%</span>
      </div>
      <div
        className="progress"
        role="progressbar"
        aria-label={label}
        aria-valuenow={rounded}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="progress-bar" style={{ width: `${rounded}%` }} />
      </div>
    </div>
  );
};
