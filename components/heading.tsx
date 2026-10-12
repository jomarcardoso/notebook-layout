// notebook-layout/components/heading.tsx
import { type ComponentProps, type FC, type ReactNode } from 'react';
import { generateClasses } from '../utils/utils';

export interface HeadingProps extends Omit<ComponentProps<'div'>, 'title'> {
  title?: ReactNode;
  titleProps?: ComponentProps<'h2'>;
  subtitle?: ReactNode;
  subtitleProps?: ComponentProps<'p'>;
  indicator?: ReactNode;
  indicatorProps?: ComponentProps<'div'>;
}

export const Heading: FC<HeadingProps> = ({
  title = '',
  titleProps,
  subtitle = '',
  subtitleProps,
  indicator = '',
  indicatorProps,
  children = '',
  className = '',
  ...props
}) => {
  return (
    <div
      {...props}
      className={generateClasses({
        heading: true,
        [className]: Boolean(className),
      })}
    >
      <h2 className="title-md" {...titleProps}>
        {title || children}
      </h2>

      {subtitle && <p {...subtitleProps}>{subtitle}</p>}

      {indicator && (
        <div className="heading__indicator" {...indicatorProps}>
          {indicator}
        </div>
      )}
    </div>
  );
};
