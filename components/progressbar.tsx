import { type FC, type ProgressHTMLAttributes, useMemo } from 'react';
import '../styles/components/progressbar.scss';
import { generateClasses } from '../utils/utils';

export type ProgressbarProps = ProgressHTMLAttributes<HTMLProgressElement>;

export const Progressbar: FC<ProgressbarProps> = ({
  className = '',
  max = 100,
  value,
  ...props
}) => {
  const classes = useMemo(
    () =>
      generateClasses({
        progressbar: true,
        [className]: !!className,
      }),
    [className],
  );

  return <progress className={classes} max={max} value={value} {...props} />;
};
